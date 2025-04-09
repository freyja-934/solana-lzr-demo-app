import { ReactNode } from 'react';

interface SkeletonProps {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Skeleton = ({
  children,
  className = '',
  isLoading = true,
}: SkeletonProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`animate-pulse bg-gray-700/50 rounded-md ${className}`}>
      {children}
    </div>
  );
};
