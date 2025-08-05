import { Suspense } from 'react';
import type { Category } from '@/components/category-selector';
import { HomeClient } from '@/components/home-client';

// This is the parent Server Component that correctly handles searchParams
export default function HomePage({
  searchParams,
}: {
  searchParams: { category?: Category };
}) {
  const initialCategory = searchParams?.category;

  return (
    <Suspense>
      <HomeClient initialCategory={initialCategory} />
    </Suspense>
  );
}
