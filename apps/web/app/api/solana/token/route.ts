import { NextResponse } from 'next/server';
const indexerUrl = 'http://localhost:3001/api/solana';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const response = await fetch(
      `${indexerUrl}/token-metadata-devnet/${token}`,
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching token info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token info' },
      { status: 500 },
    );
  }
}
