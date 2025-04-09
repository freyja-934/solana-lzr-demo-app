import {
  TransactionListResponse,
  TransactionRequest,
  TransactionResponse,
} from '@repo/types';
import { NextResponse } from 'next/server';

const indexerUrl = 'http://localhost:3001/api/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit') as string)
      : 10;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset') as string)
      : 0;

    const result = await fetch(`${indexerUrl}?limit=${limit}&offset=${offset}`);

    if (!result.ok) {
      console.error(
        'Failed to fetch from backend:',
        result.status,
        result.statusText,
      );
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 },
      );
    }

    const transactions = await result.json();

    const response: TransactionListResponse = transactions;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TransactionRequest;

    const response: TransactionResponse = {
      success: true,
      message: 'Transaction processed successfully',
      data: {
        id: '3',
        hash: '0x' + Math.random().toString(16).substring(2, 66),
        from: body.from,
        to: body.to,
        value: body.value,
        timestamp: Date.now(),
        status: 'pending',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 },
    );
  }
}
