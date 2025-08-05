import { Leaf } from 'lucide-react';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { Button } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">SnapThePlant</span>
          </Link>
          <nav>
            <Button variant="link" asChild>
                <Link href="/pricing">Pricing</Link>
            </Button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
            <UserNav />
        </div>
      </div>
    </header>
  );
}
