import { NextResponse } from 'next/server';

const indexerUrl = 'http://localhost:3001/api/solana/initialize';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(indexerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize user: ${response.statusText}`);
    }

    const data = await response.text();
    return new NextResponse(data);
  } catch (error) {
    console.error('Error initializing user:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user' },
      { status: 500 },
    );
  }
}
