
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategorySelector } from '@/components/category-selector';
import type { Category } from '@/lib/categories';
import { SiteHeader } from '@/components/site-header';

export default function SubmissionsPage() {
  const router = useRouter();

  const handleCategorySelect = (category: Category) => {
    // Redirect to the main identification flow with the selected category
    // Using window.location.href to ensure a full navigation, which can help break out of component state loops
    const homeUrl = new URL('/', window.location.origin);
    homeUrl.searchParams.set('category', category);
    window.location.href = homeUrl.toString();
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">New Submission</CardTitle>
                    <CardDescription className="text-lg">
                        What would you like to submit? Select a category below to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CategorySelector selectedCategory={null} onSelectCategory={handleCategorySelect} />
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
