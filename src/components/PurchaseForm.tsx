'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useActionState, useEffect, useState } from 'react'; // Changed from react-dom to react and useFormState to useActionState
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product, SubProduct, UserProfile } from '@/types';
import { initiatePurchase, type PurchaseFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MOCK_USER_PROFILE, PATHS } from '@/lib/constants'; // For balance check simulation
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const purchaseFormSchemaBase = z.object({
  productId: z.string(),
  productName: z.string(),
  subProductId: z.string().optional(),
  subProductName: z.string().optional(),
  amount: z.number().positive(),
});

const authDetailsSchema = z.object({
  login: z.string().min(1, 'Login is required.'),
  password: z.string().min(1, 'Password is required.'),
  twoFactorEnabled: z.boolean().default(false),
});

type PurchaseFormProps = {
  product: Product;
  selectedSubProduct?: SubProduct;
};

export default function PurchaseForm({ product, selectedSubProduct }: PurchaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [showAuthFields, setShowAuthFields] = useState(product.requiresAuthDetails || false);
  
  const finalPrice = selectedSubProduct?.price ?? product.price ?? 0;

  const currentFormSchema = showAuthFields
    ? purchaseFormSchemaBase.merge(authDetailsSchema)
    : purchaseFormSchemaBase;

  type PurchaseFormValues = z.infer<typeof currentFormSchema>;

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: {
      productId: product.id,
      productName: product.name,
      subProductId: selectedSubProduct?.id,
      subProductName: selectedSubProduct?.name,
      amount: finalPrice,
      login: '',
      password: '',
      twoFactorEnabled: false,
    },
  });

  const [state, formAction] = useActionState<PurchaseFormState | undefined, FormData>(initiatePurchase, undefined); // Changed useFormState to useActionState
  const [userBalance, setUserBalance] = useState(MOCK_USER_PROFILE.balance); // Simulate fetching balance

  useEffect(() => {
    if (product.requiresAuthDetails) {
      setShowAuthFields(true);
    }
  }, [product.requiresAuthDetails]);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Purchase Successful!',
        description: state.message,
      });
      if (state.redirectToChat) {
        // Simulate redirect to an embedded chat or Telegram
        // For now, redirect to home page after a delay
        setTimeout(() => {
          router.push(`${PATHS.HOME}?purchase_success=true&order_id=${state.orderId}`);
        }, 2000);
      }
       // Update balance display locally
       setUserBalance(currentBalance => currentBalance - finalPrice);
    } else if (state?.message && !state.success) {
      toast({
        title: 'Purchase Failed',
        description: state.message,
        variant: 'destructive',
      });
      if(state.errors?.general?.includes('Insufficient balance. Please top up your account. Redirecting... (simulated)')){
        setTimeout(() => router.push(PATHS.TOP_UP), 2000);
      }
    }
  }, [state, toast, router, finalPrice]);

  const handleBuyClick = () => {
    // Client-side balance check before submitting form
    if (userBalance < finalPrice) {
      toast({
        title: 'Insufficient Balance',
        description: 'Your current balance is too low for this purchase. Redirecting to top-up.',
        variant: 'destructive',
      });
      setTimeout(() => router.push(PATHS.TOP_UP), 2000);
      return;
    }
    // If balance is sufficient, submit the form
    form.handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formAction(formData);
    })();
  };

  return (
    <Card className="w-full max-w-lg bg-card/80 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Purchase: {product.name}
          {selectedSubProduct ? ` - ${selectedSubProduct.name}` : ''}
        </CardTitle>
        <CardDescription>
          Complete your purchase for <span className="font-semibold text-accent">${finalPrice.toFixed(2)}</span>.
          Your current balance: <span className="font-semibold text-accent">${userBalance.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => handleBuyClick())} className="space-y-0">
          <CardContent className="space-y-6">
            {/* Hidden fields for product details */}
            <input type="hidden" {...form.register('productId')} />
            <input type="hidden" {...form.register('productName')} />
            {selectedSubProduct && <input type="hidden" {...form.register('subProductId')} />}
            {selectedSubProduct && <input type="hidden" {...form.register('subProductName')} />}
            <input type="hidden" {...form.register('amount', { valueAsNumber: true })} />

            {showAuthFields && (
              <>
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login/Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your_login" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="your_password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                      <div className="space-y-0.5">
                        <FormLabel>Enable 2FA Processing</FormLabel>
                        <FormDescription>
                          Check if we need to handle a 2FA code for this service.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {state?.message && !state.success && state.errors?.general && (
                 <Alert variant="destructive">
                   <Terminal className="h-4 w-4" />
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>
                     {state.errors.general.join(', ')}
                   </AlertDescription>
                 </Alert>
               )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-glow" disabled={form.formState.isSubmitting || userBalance < finalPrice}>
              {form.formState.isSubmitting ? 'Processing...' : `Buy Now for $${finalPrice.toFixed(2)}`}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
