
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
// LanguageSwitcher removed as it's not needed for a single language setup

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
          <ShoppingBag className="h-7 w-7" />
          QuickBuy TG
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
