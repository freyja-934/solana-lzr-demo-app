import { Card } from '@repo/ui';
import { headers } from 'next/headers';
import Image from 'next/image';

const lazer_tkn_address = 'FetsjyT1gddRKAuRHuEZq7mmLf2cNGpeMSSZPdSFtE6N';

async function fetchTokenInfo(token: string) {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(
    `${protocol}://${host}/api/solana/token?token=${token}`,
  );
  const data = await res.json();
  const uri = data.uri;
  const metadata = await fetch(uri).then(res => res.json());
  return {
    data,
    metadata,
  };
}

export default async function TokenInfo() {
  const { data, metadata } = await fetchTokenInfo(lazer_tkn_address);

  return (
    <Card width="600px">
      <div>
        {metadata && (
          <div className="flex items-center gap-2">
            <Image
              src={metadata.image}
              alt="Token Image"
              width={200}
              height={200}
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">{metadata.name}</h1>
              <p className="text-sm font-bold">{metadata.symbol}</p>
              <p className="text-sm">{metadata.description}</p>
              <hr />
              <p className="text-xs">Mint: {data.mint}</p>
              <p className="text-xs">URI: {data.uri}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
