import React from 'react';

interface ProductSkeletonProps {
  isAuction?: boolean;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ isAuction }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        {/* Badge Skeletons */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>
        
        {/* Auction Overlay Skeleton */}
        {isAuction && (
          <div className="absolute bottom-4 left-4 right-4 h-12 bg-gray-200/50 backdrop-blur-sm rounded-2xl" />
        )}
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3 flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          {isAuction && <div className="h-3 w-12 bg-gray-100 rounded-full" />}
        </div>
        
        {/* Title Skeletons */}
        <div className="space-y-2 mb-6">
          <div className="h-5 w-full bg-gray-100 rounded" />
          <div className="h-5 w-2/3 bg-gray-100 rounded" />
        </div>

        {isAuction ? (
          <div className="mt-auto space-y-4">
            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-gray-50 rounded-2xl border border-gray-100" />
              <div className="h-16 bg-gray-50 rounded-2xl border border-gray-100" />
            </div>
            {/* Buttons Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-gray-100 rounded-2xl" />
              <div className="h-12 bg-gray-50 rounded-2xl border border-gray-100" />
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-3 w-12 bg-gray-100 rounded" />
              <div className="h-6 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-24 bg-gray-100 rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSkeleton;
