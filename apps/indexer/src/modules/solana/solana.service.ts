import {
  createFungible,
  fetchMetadataFromSeeds,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createAssociatedToken,
  findAssociatedTokenPda,
  mintTokensTo,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox';
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from '@metaplex-foundation/umi';
import { createUmi as createUmiWithEndpoint } from '@metaplex-foundation/umi-bundle-defaults';
import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class SolanaService {
  private umi = createUmiWithEndpoint('https://api.devnet.solana.com')
    .use(mplToolbox())
    .use(mplTokenMetadata());
  private bs58: any;

  constructor() {
    const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
    const kp = this.umi.eddsa.createKeypairFromSecretKey(secretKey);
    this.umi.use(keypairIdentity(kp));

    import('bs58').then(module => {
      this.bs58 = module.default;
    });
  }

  async createToken(metadata: {
    name: string;
    symbol: string;
    uri: string;
    decimals: number;
    amount: number;
  }): Promise<string> {
    const { name, symbol, uri, decimals, amount } = metadata;
    const mint = generateSigner(this.umi);
    const owner = this.umi.identity.publicKey;

    const tokenAccount = findAssociatedTokenPda(this.umi, {
      mint: mint.publicKey,
      owner: owner,
    });

    await createFungible(this.umi, {
      mint,
      authority: this.umi.identity,
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals,
    }).sendAndConfirm(this.umi);

    await createAssociatedToken(this.umi, {
      mint: mint.publicKey,
      owner,
    }).sendAndConfirm(this.umi);
    await mintTokensTo(this.umi, {
      mint: mint.publicKey,
      token: tokenAccount,
      amount,
      mintAuthority: this.umi.identity,
    }).sendAndConfirm(this.umi);

    return mint.publicKey.toString();
  }

  async mintToken(mintAddress: string, amount: number, destination: string) {
    try {
      const mint = new PublicKey(mintAddress);
      const destinationOwner = new PublicKey(destination);
      
      console.log('Using identity as mint authority:', this.umi.identity.publicKey.toString());

      const associatedTokenPda = findAssociatedTokenPda(this.umi, {
        mint,
        owner: destinationOwner,
      });


      const tokenAccount = await this.umi.rpc.getAccount(associatedTokenPda);
      
      if (!tokenAccount.exists) {
        console.log('Creating associated token account...');
        try {
          await createAssociatedToken(this.umi, {
            mint,
            owner: destinationOwner,
          }).sendAndConfirm(this.umi);
        } catch (error) {
          console.error('Error creating associated token account:', error);
          console.log('Attempting to mint directly...');
        }
      } else {
        console.log('Associated token account already exists');
      }

      let decimals = 9;
      try {
        const tokenMetadata = await this.getTokenMetadata(mintAddress);
        if (
          tokenMetadata &&
          tokenMetadata.mint &&
          typeof tokenMetadata.mint.decimals === 'number'
        ) {
          decimals = tokenMetadata.mint.decimals;
        } else {
          console.log(
            'Could not determine token decimals, using default value of 9',
          );
        }
      } catch (error) {
        console.error('Error getting token metadata:', error);
        console.log('Using default decimals value of 9');
      }

      const actualAmount = amount * Math.pow(10, decimals);

      console.log(
        `Minting ${amount} tokens (${actualAmount} raw units) to ${destination}...`,
      );
      
      try {
        const { signature } = await mintTokensTo(this.umi, {
          mint,
          token: associatedTokenPda,
          amount: actualAmount,
          mintAuthority: this.umi.identity,
        }).sendAndConfirm(this.umi, {
          confirm: { commitment: 'processed' },
          send: { commitment: 'processed' },
        });

        const signatureString = this.bs58.encode(signature);
        console.log('Minting successful, transaction signature:', signatureString);
        return { txId: signatureString };
      } catch (mintError) {
        console.error('Error during mintTokensTo operation:', mintError);
        console.error('This may be due to incorrect mint authority. Please verify that the private key in your environment variables corresponds to the mint authority of the token.');
        throw mintError;
      }
    } catch (error) {
      console.error('Error minting token:', error);
      throw error;
    }
  }

  async transferToken(
    mintAddress: string,
    from: string,
    to: string,
    amount: number,
  ) {
    const mint = new PublicKey(mintAddress);
    const fromOwner = new PublicKey(from);
    const toOwner = new PublicKey(to);

    const sourcePda = findAssociatedTokenPda(this.umi, {
      mint,
      owner: fromOwner,
    });
    const destPda = findAssociatedTokenPda(this.umi, {
      mint,
      owner: toOwner,
    });

    await createAssociatedToken(this.umi, {
      mint,
      owner: toOwner,
    }).sendAndConfirm(this.umi);

    await transferTokens(this.umi, {
      source: sourcePda,
      destination: destPda,
      authority: this.umi.identity,
      amount,
    }).sendAndConfirm(this.umi);

    return true;
  }

  async getTokenMetadata(mintAddress: string) {
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'test',
          method: 'getAsset',
          params: {
            id: mintAddress,
          },
        }),
      },
    );

    const data = await response.json();


    const processValue = (value: any): any => {
      if (typeof value === 'bigint') {
        return value.toString();
      } else if (Array.isArray(value)) {
        return value.map(processValue);
      } else if (value !== null && typeof value === 'object') {
        const result: any = {};
        for (const key in value) {
          result[key] = processValue(value[key]);
        }
        return result;
      }
      return value;
    };

    return processValue(data);
  }

  async getTokenMetadataDevnet(mintAddress: string) {
    const mint = new PublicKey(mintAddress);
    const metadata = await fetchMetadataFromSeeds(this.umi, {
      mint,
    });


    const processValue = (value: any): any => {
      if (typeof value === 'bigint') {
        return value.toString();
      } else if (Array.isArray(value)) {
        return value.map(processValue);
      } else if (value !== null && typeof value === 'object') {
        const result: any = {};
        for (const key in value) {
          result[key] = processValue(value[key]);
        }
        return result;
      }
      return value;
    };

    return processValue(metadata);
  }

  async getAssociatedTokenPda(mintAddress: string, walletAddress: string) {
    return findAssociatedTokenPda(this.umi, {
      mint: new PublicKey(mintAddress),
      owner: new PublicKey(walletAddress),
    });
  }

  async getNftsByWallet(wallet: string, page: number = 1, limit: number = 10) {
    const heliusApiKey = process.env.HELIUS_API_KEY;
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'text',
          method: 'getAssetsByOwner',
          params: {
            ownerAddress: wallet,
            page: page,
            limit: limit,
            sortBy: {
              sortBy: 'created',
              sortDirection: 'asc',
            },
            options: {
              showUnverifiedCollections: true,
              showCollectionMetadata: true,
              showGrandTotal: true,
              showFungible: true,
              showNativeBalance: true,
              showInscription: true,
              showZeroBalance: true,
            },
          },
        }),
      },
    );

    const data = await response.json();
    return data.result.items;
  }
}
