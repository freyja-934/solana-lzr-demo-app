import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export const WalletBalanceDisplay = () => {
  const [balance, setBalance] = useState(0);
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey || !connected) {
        console.error(
          'Wallet not connected or connection unavailable',
          `{ connection: ${!!connection}, publicKey: ${!!publicKey}, connected: ${!!connected} }`,
        );
        return;
      }
      connection.onAccountChange(
        publicKey,
        accountInfo => {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        },
        'confirmed',
      );
      const accountInfo = await connection.getAccountInfo(publicKey);
      if (accountInfo) {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      }
    };
    updateBalance();
  }, [publicKey, connection]);

  return <div>{balance} SOL</div>;
};
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { FC, useEffect, useState } from "react";

// export const BalanceDisplay: FC = () => {
//   const [balance, setBalance] = useState(0);
//   const { connection } = useConnection();
//   const { publicKey } = useWallet();

//   useEffect(() => {
//     const updateBalance = async () => {
//       if (!connection || !publicKey) {
//         console.error("Wallet not connected or connection unavailable");
//       }

//       try {
//         connection.onAccountChange(
//           publicKey,
//           (updatedAccountInfo) => {
//             setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
//           },
//           "confirmed",
//         );

//         const accountInfo = await connection.getAccountInfo(publicKey);

//         if (accountInfo) {
//           setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
//         } else {
//           throw new Error("Account info not found");
//         }
//       } catch (error) {
//         console.error("Failed to retrieve account info:", error);
//       }
//     };

//     updateBalance();
//   }, [connection, publicKey]);

//   return (
//     <div>
//       <p>{publicKey ? `Balance: ${balance} SOL` : ""}</p>
//     </div>
//   );
// };
