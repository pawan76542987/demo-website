import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search query or filter criteria.'
}) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText="Browse All Categories"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
