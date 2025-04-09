import { NextResponse } from 'next/server';

const indexerUrl = 'http://localhost:3001/api/solana/nfts';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const url = `${indexerUrl}/${wallet}?page=${page}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 },
    );
  }
}
