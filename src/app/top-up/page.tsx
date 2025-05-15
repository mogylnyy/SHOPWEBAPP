import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LAVA_IO_TOP_UP_URL, LAVA_IO_QR_CODE_IMAGE } from '@/lib/constants';
import { CreditCard, QrCode, ExternalLink } from 'lucide-react';

export default function TopUpPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Top-Up Balance</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Add funds to your ИИMPERIUM SHOP account.
        </p>
      </div>

      <Card className="bg-card/80 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center text-primary">
            <CreditCard className="h-6 w-6 mr-2" /> Using Lava.io
          </CardTitle>
          <CardDescription>
            Click the button below to proceed to Lava.io for a secure top-up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button asChild size="lg" className="w-full btn-glow bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            <Link href={LAVA_IO_TOP_UP_URL} target="_blank" rel="noopener noreferrer">
              Go to Lava.io <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center text-foreground">
              <QrCode className="h-5 w-5 mr-2 text-primary" /> Scan QR Code
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Scan the QR code below with a compatible payment app. (This is a placeholder)
            </p>
            <div className="flex justify-center p-4 border rounded-lg bg-background/50">
              <Image
                src={LAVA_IO_QR_CODE_IMAGE}
                alt="Lava.io QR Code for Top-Up"
                width={200}
                height={200}
                className="rounded-md shadow-md"
                data-ai-hint="QR code payment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full text-base font-semibold"
          asChild
        >
          <a href="/">
            <svg className="mr-2 h-5 w-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"></path></svg>
            Главное меню
          </a>
        </Button>
      </div>
    </div>
  );
}
