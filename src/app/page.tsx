import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, CreditCard, HelpCircle, ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';

const menuItems = [
  {
    href: PATHS.SHOP,
    label: 'Shop',
    icon: <ShoppingCart className="h-8 w-8" />,
    description: "Browse our catalog of products."
  },
  {
    href: PATHS.PROFILE,
    label: 'Profile',
    icon: <User className="h-8 w-8" />,
    description: "View your account details and order history."
  },
  {
    href: PATHS.TOP_UP,
    label: 'Top-Up Balance',
    icon: <CreditCard className="h-8 w-8" />,
    description: "Add funds to your account."
  },
  {
    href: PATHS.HELP,
    label: 'Help & FAQ',
    icon: <HelpCircle className="h-8 w-8" />,
    description: "Get assistance and find answers."
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          QuickBuy TG
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Your one-stop shop for digital goods and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-4xl">
        {menuItems.map((item) => (
          <Card key={item.href} className="bg-card/80 backdrop-blur-md shadow-xl hover:shadow-primary/30 transition-shadow duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-semibold text-primary group-hover:text-accent transition-colors">
                {item.label}
              </CardTitle>
              <div className="text-accent group-hover:text-primary transition-colors">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{item.description}</p>
              <Button asChild variant="outline" size="lg" className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10">
                <Link href={item.href}>
                  Go to {item.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
