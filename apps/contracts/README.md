ANCHOR\*PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=~/.config/solana/id.json npx ts-mocha -p ./tsconfig.json -t 1000000 tests/\*\*/\_.ts

anchor deploy --provider.cluster devnet
