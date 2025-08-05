import { Leaf } from 'lucide-react';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { Button } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold sm:inline-block font-headline">SnapThePlant</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="link" asChild>
                <Link href="/explore">Explore</Link>
            </Button>
             <Button variant="link" asChild>
                <Link href="/community">Community</Link>
            </Button>
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
