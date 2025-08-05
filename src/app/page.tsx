
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/categories';
import { HomeClient } from '@/components/home-client';

// This component is wrapped in Suspense to handle the initial render
function HomePageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | undefined;

  return <HomeClient initialCategory={initialCategory} />;
}

// This is the main export for the page
export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}
