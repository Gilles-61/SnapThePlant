
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold sm:inline-block font-headline">SnapThePlant</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
