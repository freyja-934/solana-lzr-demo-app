import Image from 'next/image';
import Link from 'next/link';
import { CardClient } from './components/ui/CardClient';

export default function Home() {
  return (
    <div>
      <div className="min-h-screen gap-4 bg-lzr bg-cover bg-center bg-no-repeat bg-fixed w-full h-full z-10">
        <div className="flex flex-col justify-around items-center h-screen">
          <div className="mt-[100px] flex flex-col items-center gap-4 ">
            <h1 className="text-6xl font-bold">Welcome to Solazer</h1>
            <p>
              An easy way to get started with Solana—powered by light-speed
              transactions.
            </p>
          </div>
          <div className="flex gap-4">
            <CardClient width="400px">
              <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-500">STEP 1</div>
                <h2 className="text-2xl font-bold">Get a Solana wallet</h2>
                <p className="text-gray-400" text-xs>
                  A Solana wallet is a digital wallet that allows you to store,
                  send, and receive Solana. It is a secure and easy way to
                  manage your Solana.
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-lg"
                    src="/phantom-wallet.svg"
                    alt="Solana wallet"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="text-gray-400 text-xs">Phantom</p>
                    <a
                      href="https://phantom.app/"
                      className="text-purple-400 underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Install Phantom Wallet
                    </a>
                  </div>
                </div>
              </div>
            </CardClient>
            <CardClient width="400px">
              <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-500">STEP 2</div>
                <h2 className="text-2xl font-bold">Request Airdrop SOL</h2>
                <p className="text-gray-400" text-xs>
                  Request a free airdrop of SOL to your wallet. Go to{' '}
                  <a
                    href="https://faucet.solana.com/"
                    className="text-purple-400 underline text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://faucet.solana.com/
                  </a>{' '}
                  and paste your wallet address. Select the devnet and amount.
                </p>
              </div>
            </CardClient>
            <CardClient width="400px">
              <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-500">STEP 3</div>
                <h2 className="text-2xl font-bold">Swap to the Devnet</h2>
                <p className="text-gray-400" text-xs>
                  Swap to the Devnet to start building on Solana. Open your
                  phantom wallet, go to settings -{'>'} developer settings and
                  change the network to Devnet.
                </p>
              </div>
            </CardClient>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-20">
        <div className="container max-w-6xl mx-auto text-center flex flex-col gap-4 min-h-[33vh] justify-center items-center">
          <h2 className="text-2xl font-bold">Post Messages on Solazer</h2>
          <p className="text-gray-400" text-xs>
            Post a message to the Solazer contract on the solana devnet.
            Contract address:{' '}
            <a
              href="https://explorer.solana.com/address/CBrNSSuPm5fa9AVdgeYrswKKAcvcmKN85hrgEtnXKj98?cluster=devnet"
              className="text-purple-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CBrNSSuPm5fa9AVdgeYrswKKAcvcmKN85hrgEtnXKj98
            </a>
            .
          </p>

          <p className="text-gray-400" text-xs>
            This Anchor-based Solana program allows users to post messages
            on-chain. Each user has a unique User account (PDA) that tracks
            their message count, and each message is stored as a Message account
            (PDA) derived from the user and message index. When a message is
            posted, it records the message, author, timestamp, and index, and
            emits a MessagePosted event for indexing or listening.
          </p>
          <Link href="/messages">
            <button>Post a Message</button>
          </Link>
        </div>

        <div className="container max-w-6xl mx-auto text-center flex flex-col gap-4 min-h-[33vh] justify-center items-center">
          <CardClient width="70vw" className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4 pr-4 border-r border-gray-200 dark:border-gray-700">
              <Image
                src="/lzr-token.png"
                alt="LAZR Token"
                width={300}
                height={300}
              />
              <div className="text-left flex flex-col gap-4">
                <h3 className="text-xl font-bold">LAZR Token</h3>
                <div>
                  <div className="text-xs text-gray-500">
                    LAZR Token Address
                  </div>
                  <a
                    href="https://explorer.solana.com/address/FetsjyT1gddRKAuRHuEZq7mmLf2cNGpeMSSZPdSFtE6N?cluster=devnet"
                    className="text-purple-400 underline break-words text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FetsjyT1gddRKAuRHuEZq7mmLf2cNGpeMSSZPdSFtE6N
                  </a>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LAZR Token Symbol</div>
                  <div className="text-sm">LAZR</div>
                </div>
                <Link href="/faucet">
                  <button>Get LAZR</button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-left ">
              <h2 className="text-2xl font-bold">LAZR Faucet - Airdrop</h2>
              <p className="text-gray-400" text-xs>
                Mint the LAZR token to your wallet with our faucet. The LAZR
                token is a utility token for rewarding on-chain message posters
                in the LAZR dApp.
              </p>

              <p className="text-gray-400" text-xs>
                The airdrop feature enables users to receive a custom SPL token
                directly into their wallet. The backend service checks whether
                the user's associated token account (ATA) exists for the given
                mint address. If it doesn't, it creates the ATA using the token
                mint and wallet address as a deterministic seed (PDA). Once the
                ATA is ready, the service mints the specified amount of tokens
                and deposits them into the user's wallet. This process is fully
                automated, ensuring a seamless one-click airdrop experience for
                users.
              </p>
            </div>
          </CardClient>
        </div>

        <div className="container max-w-6xl mx-auto text-center flex flex-col gap-4 min-h-[33vh] justify-center items-center">
          <h2 className="text-2xl font-bold">View Your Wallet's NFTs</h2>

          <p className="text-gray-400" text-xs>
            View your connected wallet’s SOL balance, custom tokens, and NFTs
            all in one place. Instantly see what assets you hold on the Solana
            devnet.
          </p>
          <Link href="/nfts">
            <button>View NFTs</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
