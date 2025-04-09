import * as anchor from '@coral-xyz/anchor';
import * as borsh from '@coral-xyz/borsh';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CustomTransaction,
  MessageAccount,
  TransactionListResponse,
} from '@repo/types';
import {
  Connection,
  Keypair,
  Logs,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import idl from '../../idl/transfer_program.json';
import { EventGateway } from './event.gateway';
const PROGRAM_ID = new PublicKey(
  'CBrNSSuPm5fa9AVdgeYrswKKAcvcmKN85hrgEtnXKj98',
);
const ACCOUNT_DISCRIMINATOR_SIZE = 8;

const processedTransactions = new Set<string>();

const MESSAGE_ACCOUNT_LAYOUT = borsh.struct([
  borsh.publicKey('author'),
  borsh.str('message'),
  borsh.u64('index'),
  borsh.u64('timestamp'),
]);

const USER_ACCOUNT_LAYOUT = borsh.struct([
  borsh.publicKey('author'),
  borsh.u64('messageCount'),
]);

const sampleTransactions: CustomTransaction[] = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    value: '1000000000000000000', // 1 ETH in wei
    timestamp: Date.now(),
    status: 'confirmed',
  },
  {
    id: '2',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    value: '500000000000000000', // 0.5 ETH in wei
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'confirmed',
  },
];

@Injectable()
export class EventService implements OnModuleInit {
  private program: any;
  private connection: Connection;
  private provider: anchor.AnchorProvider;
  private wallet: anchor.Wallet;
  private eventParser: anchor.EventParser;

  constructor(
    private config: ConfigService,
    private eventGateway: EventGateway,
  ) {
    const privateKey = Uint8Array.from(
      JSON.parse(this.config.get('PRIVATE_KEY')),
    );
    const rpcUrl = this.config.get<string>('RPC_URL')!;
    const keypair = Keypair.fromSecretKey(privateKey);

    this.wallet = new anchor.Wallet(keypair);
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.provider = new anchor.AnchorProvider(this.connection, this.wallet, {
      preflightCommitment: 'confirmed',
    });

    anchor.setProvider(this.provider);
  }

  async onModuleInit() {
    this.program = new anchor.Program(idl as anchor.Idl, this.provider);
    (this.program as any)._programId = PROGRAM_ID;

    this.eventParser = new anchor.EventParser(
      this.program.programId,
      this.program.coder,
    );

    this.connection.onLogs(PROGRAM_ID, this.handleLogs.bind(this), 'finalized');
  }

  private async handleLogs(logs: Logs) {
    if (logs.signature && processedTransactions.has(logs.signature)) {
      console.log(
        `Skipping already processed transaction to prevent dupes: ${logs.signature}`,
      );
      return;
    }


    if (logs.signature) {
      processedTransactions.add(logs.signature);


      if (processedTransactions.size > 1000) {
        const values = Array.from(processedTransactions);
        processedTransactions.clear();
        values.slice(-500).forEach(sig => processedTransactions.add(sig));
      }
    }

    // TODO: Can index logs here and send to the database
    console.log('🔔 Received logs:', logs.logs);

    try {
      const events = Array.from(this.eventParser.parseLogs(logs.logs));
      console.log('🧠 Events:', events);

      if (events.length === 0) {
        console.log('❌ No events parsed.');
        return;
      }

      for (const event of events) {
        console.log(`Event: ${event.name}`, event.data);
        this.eventGateway.broadcastEvent('message-posted', {
          author: event.data.author.toBase58(),
          message: event.data.message,
          index: event.data.index.toNumber(),
          timestamp: event.data.timestamp.toNumber(),
        });
      }
    } catch (err) {
      console.error('Failed to parse logs:', err);
    }
  }

  async getEvents(
    limit: number,
    offset: number,
  ): Promise<TransactionListResponse> {
    const paginatedTransactions = sampleTransactions.slice(
      offset,
      offset + limit,
    );

    return {
      transactions: paginatedTransactions,
      total: sampleTransactions.length,
      limit,
      offset,
    };
  }

  async getAllMessages(): Promise<MessageAccount[]> {
    const accounts = await this.connection.getProgramAccounts(PROGRAM_ID);
    console.log('Found accounts:', accounts.length);
    const messages: MessageAccount[] = [];

    for (const account of accounts) {
      try {
        console.log('Processing account:', account.pubkey.toBase58());
        const accountData = account.account.data.slice(
          ACCOUNT_DISCRIMINATOR_SIZE,
        );
        const decoded = MESSAGE_ACCOUNT_LAYOUT.decode(accountData);
        messages.push({
          author: decoded.author.toBase58(),
          message: decoded.message,
          timestamp: Number(decoded.timestamp) * 1000,
          index: Number(decoded.index),
        });
        console.log('Successfully decoded message:', decoded.message);
      } catch (err) {
        console.log('Error decoding message account:', err);
        continue;
      }
    }

    return messages.sort((a, b) => a.index - b.index);
  }

  async getUserMessages(author: string): Promise<MessageAccount[]> {
    const authorPubkey = new PublicKey(author);
    const [userPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user-state'), authorPubkey.toBuffer()],
      PROGRAM_ID,
    );

    try {
      const userAccount = await this.connection.getAccountInfo(userPda);
      if (!userAccount) {
        return [];
      }

      const userData = USER_ACCOUNT_LAYOUT.decode(
        userAccount.data.slice(ACCOUNT_DISCRIMINATOR_SIZE),
      ) as { messageCount: bigint };
      const messageCount = Number(userData.messageCount);

      const messages: MessageAccount[] = [];
      for (let i = 0; i < messageCount; i++) {
        const indexBuffer = Buffer.alloc(8);
        indexBuffer.writeBigUInt64LE(BigInt(i));

        const [messagePda] = PublicKey.findProgramAddressSync(
          [Buffer.from('message'), authorPubkey.toBuffer(), indexBuffer],
          PROGRAM_ID,
        );

        const messageAccount = await this.connection.getAccountInfo(messagePda);
        if (messageAccount) {
          const decoded = MESSAGE_ACCOUNT_LAYOUT.decode(
            messageAccount.data.slice(ACCOUNT_DISCRIMINATOR_SIZE),
          );
          messages.push({
            author: decoded.author.toBase58(),
            message: decoded.message,
            timestamp: Number(decoded.timestamp) * 1000,
            index: Number(decoded.index),
          });
        }
      }

      return messages.sort((a, b) => a.index - b.index);
    } catch (err) {
      console.log('Error fetching user messages:', err);
      return [];
    }
  }

  async getPostMessageTx(message: string, author: string) {
    console.log('Getting post message transaction for:', { message, author });

    const authorPubkey = new PublicKey(author);
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('user-state'), authorPubkey.toBuffer()],
      PROGRAM_ID,
    );

    const instructions = [];

    const userAccountInfo = await this.connection.getAccountInfo(userAccount);

    if (!userAccountInfo) {
      console.log('User account not found, adding initializeUser instruction');
      const initIx = await this.program.methods
        .initializeUser()
        .accounts({
          author: authorPubkey,
          user: userAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      instructions.push(initIx);
    }

    let messageCount = 0;
    if (userAccountInfo) {
      const userData = await this.program.account.user.fetch(userAccount);
      messageCount = Number(userData.messageCount);
    }

    const messageCountBuffer = Buffer.alloc(8);
    messageCountBuffer.writeBigUInt64LE(BigInt(messageCount));

    const [messageAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('message'), authorPubkey.toBuffer(), messageCountBuffer],
      PROGRAM_ID,
    );

    const postIx = await this.program.methods
      .postMessage(message)
      .accounts({
        author: authorPubkey,
        user: userAccount,
        messageAccount,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    instructions.push(postIx);

    const tx = new Transaction();
    instructions.forEach(ix => tx.add(ix));
    tx.feePayer = authorPubkey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    console.log(
      'Transaction created successfully with',
      instructions.length,
      'instructions',
    );

    const serializedTx = tx
      .serialize({ requireAllSignatures: false })
      .toString('base64');
    console.log('Serialized transaction length:', serializedTx.length);

    return serializedTx;
  }

  async fetchMessages(): Promise<MessageAccount[]> {
    try {
      const accounts = await this.program.account.user.all();
      return accounts.map(account => ({
        author: account.publicKey.toString(),
        message: `Message count: ${account.account.messageCount}`,
        index: Number(account.account.messageCount),
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getInitializeUserTx(author: string) {
    console.log('Getting initialize transaction for author:', author);

    const [userAccount, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('user-state'), new PublicKey(author).toBuffer()],
      PROGRAM_ID,
    );
    console.log('User account PDA:', userAccount.toBase58());

    try {
      const authorPubkey = new PublicKey(author);
      const ix = await this.program.methods
        .initializeUser()
        .accounts({
          author: authorPubkey,
          user: userAccount,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const tx = new Transaction().add(ix);
      tx.feePayer = authorPubkey;
      tx.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;

      console.log('Transaction created successfully');
      const serializedTx = tx
        .serialize({ requireAllSignatures: false })
        .toString('base64');
      console.log('Serialized transaction length:', serializedTx.length);

      return serializedTx;
    } catch (error) {
      console.error('Error creating initialize transaction:', error);
      throw error;
    }
  }
}
