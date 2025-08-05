
'use client';

import { PricingPage } from '@/components/pricing-page';
import { SiteHeader } from '@/components/site-header';

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <PricingPage />
      </main>
    </div>
  );
}
