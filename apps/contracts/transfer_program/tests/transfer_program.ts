import * as anchor from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import { expect } from 'chai';

describe('transfer_program', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TransferProgram;

  const u64 = (n: number) => new BN(n).toArrayLike(Buffer, 'le', 8);

  it('initializes a user and posts a message', async () => {
    const author = provider.wallet.publicKey;

    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('user-state'), author.toBuffer()],
      program.programId,
    );

    const [messagePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('message'), author.toBuffer(), u64(0)],
      program.programId,
    );

    await program.methods
      .initializeUser()
      .accounts({
        author: author,
        user: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .postMessage('Hello Anchor!')
      .accounts({
        author: author,
        user: userPda,
        messageAccount: messagePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const user = await program.account.user.fetch(userPda);
    const message = await program.account.message.fetch(messagePda);

    expect(user.messageCount.toNumber()).to.equal(1);
    expect(message.message).to.equal('Hello Anchor!');
    expect(message.index.toNumber()).to.equal(0);
    expect(message.author.toBase58()).to.equal(author.toBase58());
  });

  it('can fetch all messages for a user', async () => {
    const author = provider.wallet.publicKey;

    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('user-state'), author.toBuffer()],
      program.programId,
    );

    await program.methods
      .initializeUser()
      .accounts({
        author: author,
        user: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const messages = ['First message!', 'Second message!', 'Third message!'];
    for (let i = 0; i < messages.length; i++) {
      const [messagePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('message'), author.toBuffer(), u64(i)],
        program.programId,
      );

      await program.methods
        .postMessage(messages[i])
        .accounts({
          author: author,
          user: userPda,
          messageAccount: messagePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    }


    const user = await program.account.user.fetch(userPda);
    expect(user.messageCount.toNumber()).to.equal(messages.length);


    const allMessages = await program.account.message.all([
      {
        memcmp: {
          offset: 8, 
          bytes: author.toBase58(),
        },
      },
    ]);


    allMessages.sort(
      (a, b) => a.account.index.toNumber() - b.account.index.toNumber(),
    );


    expect(allMessages.length).to.equal(messages.length);
    allMessages.forEach((msg, i) => {
      expect(msg.account.message).to.equal(messages[i]);
      expect(msg.account.index.toNumber()).to.equal(i);
      expect(msg.account.author.toBase58()).to.equal(author.toBase58());
    });
  });
});
