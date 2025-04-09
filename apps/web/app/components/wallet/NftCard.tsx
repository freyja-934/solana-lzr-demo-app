import { HeliusNFT } from '@repo/types';
import { Card } from '@repo/ui';
import Image from 'next/image';
import { useState } from 'react';

export const NftCard = ({ nft }: { nft: HeliusNFT }) => {
  const {
    content: { metadata },
    id,
  } = nft;
  const imageUrl = nft.content.links.image;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="overflow-hidden">
      <Card width="200px">
        <div className="relative w-full h-[160px] bg-gray-800">
          {!imageError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={metadata.name}
              width={180}
              height={180}
              quality={40}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              loading="lazy"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-gray-500 text-center p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Image not available</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 truncate">{metadata.name}</div>
        <div className="p-2 truncate">Symbol: {metadata.symbol || '-'}</div>
        <div className="p-2 truncate text-xs">{id}</div>
      </Card>
    </div>
  );
};
