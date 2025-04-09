import { NextResponse } from 'next/server';

const indexerUrl = 'http://localhost:3001/api/events/messages';

export async function GET() {
  try {
    const response = await fetch(indexerUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    );
  }
}

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
      throw new Error(`Failed to post message: ${response.statusText}`);
    }

    const data = await response.text();
    return new NextResponse(data);
  } catch (error) {
    console.error('Error posting message:', error);
    return NextResponse.json(
      { error: 'Failed to post message' },
      { status: 500 },
    );
  }
}
