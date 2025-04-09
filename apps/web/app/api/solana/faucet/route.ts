import { NextResponse } from 'next/server';
const indexerUrl = 'http://localhost:3001/api/solana';

export async function POST(request: Request) {
  const { wallet, amount, mint } = await request.json();
  console.log(wallet, amount, mint);
  const response = await fetch(
    `${indexerUrl}/mint/?destination=${wallet}&amount=${amount}&mint=${mint}`,
  );
  const data = await response.json();
  return NextResponse.json(data);
}
