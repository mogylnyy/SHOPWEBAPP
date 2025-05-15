import { MOCK_USER_PROFILE, PATHS } from '@/lib/constants';
import type { UserProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, DollarSign, ShoppingBag, LogOut, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Simulate API call
async function getUserProfile(): Promise<UserProfile> {
  // In a real app, fetch from your API, likely based on session/auth
  // const res = await fetch('/api/user/profile');
  // const data = await res.json();
  // return data;
  return Promise.resolve(MOCK_USER_PROFILE);
}

export default async function ProfilePage() {
  const user = await getUserProfile();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Your Profile</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Manage your account details and view your activity.
        </p>
      </div>

      <Card className="bg-card/80 backdrop-blur-md shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary ring-2 ring-accent ring-offset-2 ring-offset-background">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${user.username.charAt(0)}`} alt={user.username} data-ai-hint="avatar person" />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl text-primary">{user.username}</CardTitle>
          <CardDescription>User ID: {user.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 mr-3 text-accent" />
              <span className="text-lg font-medium text-foreground">Current Balance</span>
            </div>
            <span className="text-xl font-bold text-accent">${user.balance.toFixed(2)}</span>
          </div>

          <Button variant="outline" className="w-full btn-glow" asChild>
            <Link href={PATHS.TOP_UP}>
              <CreditCard className="mr-2 h-5 w-5" /> Top-Up Balance
            </Link>
          </Button>
          
          {/* Placeholder for future features */}
          <Button variant="outline" className="w-full" disabled>
            <ShoppingBag className="mr-2 h-5 w-5" /> View Order History
          </Button>
          <Button variant="destructive" className="w-full" disabled>
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
