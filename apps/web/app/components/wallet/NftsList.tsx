'use client';
import { HeliusNFT } from '@repo/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { NftCard } from './NftCard';

const ITEMS_PER_PAGE = 10;

const fetchNfts = async (
  publicKey: string,
  page: number,
): Promise<HeliusNFT[]> => {
  if (!publicKey) throw new Error('Wallet address is required');
  const response = await fetch(
    `/api/solana/nfts?wallet=${publicKey}&page=${page}&limit=${ITEMS_PER_PAGE}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch NFTs');
  }
  return response.json();
};

export const NftsList = () => {
  const { publicKey, connected } = useWallet();
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['nfts', publicKey?.toBase58()],
    queryFn: ({ pageParam = 1 }) =>
      fetchNfts(publicKey?.toBase58() ?? '', pageParam),
    enabled: !!publicKey && !!connected,
    getNextPageParam: (lastPage: string | any[], allPages: string | any[]) => {
      return lastPage.length === ITEMS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div>Loading NFTs...</div>;
  if (error) return <div>Error loading NFTs: {(error as Error).message}</div>;
  if (!data) return <div>No NFTs found</div>;

  const allNfts = data.pages.flatMap((page: any) => page);

  return (
    <div className="space-y-4">
      <div className="h-[600px] overflow-y-auto border border-gray-600 rounded-md w-fit">
        <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {allNfts.map((nft: HeliusNFT) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center mt-4"
        >
          {isFetchingNextPage ? (
            <div>Loading more...</div>
          ) : hasNextPage ? (
            <div>Load more</div>
          ) : (
            <div>No more NFTs</div>
          )}
        </div>
      </div>
    </div>
  );
};
