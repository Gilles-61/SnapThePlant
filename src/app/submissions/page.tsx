
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/categories';
import { HomeClient } from '@/components/home-client';

// This is the main export for the page
export default function SubmissionsPage() {
  // This page will reuse the HomeClient component which contains the full identification flow.
  // It's wrapped in Suspense for compatibility.
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
