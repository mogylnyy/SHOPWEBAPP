
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useActionState, useEffect, useState } from 'react';
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
import type { Product, SubProduct } from '@/types';
import { initiatePurchase, type PurchaseFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { MOCK_USER_PROFILE, PATHS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';

const purchaseFormSchemaBase = z.object({
  productId: z.string(),
  productName: z.string(),
  subProductId: z.string().optional(),
  subProductName: z.string().optional(),
  amount: z.number().positive(),
});

const authDetailsSchema = z.object({
  login: z.string().min(1, 'Логин обязателен.'), // Example of direct Russian for zod
  password: z.string().min(1, 'Пароль обязателен.'), // Example of direct Russian for zod
  twoFactorEnabled: z.boolean().default(false),
});

type PurchaseFormProps = {
  product: Product;
  selectedSubProduct?: SubProduct;
};

export default function PurchaseForm({ product, selectedSubProduct }: PurchaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useTranslation(params.locale as Locale);

  const [showAuthFields, setShowAuthFields] = useState(product.requiresAuthDetails || false);
  
  const finalPrice = selectedSubProduct?.price ?? product.price ?? 0;

  // Zod error messages can be localized here if needed, or keep them simple.
  // For simplicity, some are directly in Russian.
  const currentFormSchema = showAuthFields
    ? purchaseFormSchemaBase.merge(
        authDetailsSchema.superRefine((data, ctx) => {
          if (!data.login) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['login'],
              message: t('product_details_page.purchase_form_login_label') + " " + t('zod.errors.required'), // Example: "Логин/Email обязателен."
            });
          }
          if (!data.password) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['password'],
              message: t('product_details_page.purchase_form_password_label') + " " + t('zod.errors.required'), // Example: "Пароль обязателен."
            });
          }
        })
      )
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

  const [state, formAction] = useActionState<PurchaseFormState | undefined, FormData>(initiatePurchase, undefined);
  const [userBalance, setUserBalance] = useState(MOCK_USER_PROFILE.balance);

  useEffect(() => {
    if (product.requiresAuthDetails) {
      setShowAuthFields(true);
    }
  }, [product.requiresAuthDetails]);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: t('product_details_page.purchase_form_purchase_successful_title'),
        description: state.message, // Message from action should be in Russian or key
      });
      if (state.redirectToChat) {
        setTimeout(() => {
          router.push(`/${locale}${PATHS.HOME}?purchase_success=true&order_id=${state.orderId}`);
        }, 2000);
      }
       setUserBalance(currentBalance => currentBalance - finalPrice);
    } else if (state?.message && !state.success) {
      const isInsufficientBalanceError = state.errors?.general?.includes('Insufficient balance. Please top up your account. Redirecting... (simulated)');
      toast({
        title: isInsufficientBalanceError ? t('product_details_page.purchase_form_insufficient_balance_title') : t('product_details_page.purchase_form_purchase_failed_title'),
        description: isInsufficientBalanceError ? t('product_details_page.purchase_form_insufficient_balance_description') : state.message,
        variant: 'destructive',
      });
      if(isInsufficientBalanceError){
        setTimeout(() => router.push(`/${locale}${PATHS.TOP_UP}`), 2000);
      }
    } else if (state?.errors && !state.success) { // Generic form error from action
        toast({
            title: t('product_details_page.purchase_form_purchase_failed_title'),
            description: state.message || t('product_details_page.purchase_form_invalid_data_message'),
            variant: 'destructive',
        });
    }
  }, [state, toast, router, finalPrice, locale, t]);

  const handleBuyClick = () => {
    if (userBalance < finalPrice) {
      toast({
        title: t('product_details_page.purchase_form_insufficient_balance_title'),
        description: t('product_details_page.purchase_form_insufficient_balance_description'),
        variant: 'destructive',
      });
      setTimeout(() => router.push(`/${locale}${PATHS.TOP_UP}`), 2000);
      return;
    }
    form.handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      // Append locale to form data so action can use it if needed for messages
      formData.append('locale', locale);
      formAction(formData);
    })();
  };

  return (
    <Card className="w-full max-w-lg bg-card/80 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          {t('product_details_page.purchase_form_title_prefix')} {product.name}
          {selectedSubProduct ? ` - ${selectedSubProduct.name}` : ''}
        </CardTitle>
        <CardDescription>
          {t('product_details_page.purchase_form_description_prefix')} <span className="font-semibold text-accent">{finalPrice.toFixed(2)} ₽</span>.
          {' '}
          {t('product_details_page.purchase_form_current_balance')} <span className="font-semibold text-accent">{userBalance.toFixed(2)} ₽</span>
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); handleBuyClick(); }} className="space-y-0">
          <CardContent className="space-y-6">
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
                      <FormLabel>{t('product_details_page.purchase_form_login_label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('product_details_page.purchase_form_login_placeholder')} {...field} />
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
                      <FormLabel>{t('product_details_page.purchase_form_password_label')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('product_details_page.purchase_form_password_placeholder')} {...field} />
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
                        <FormLabel>{t('product_details_page.purchase_form_2fa_label')}</FormLabel>
                        <FormDescription>
                          {t('product_details_page.purchase_form_2fa_description')}
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
                   <AlertTitle>{t('product_details_page.purchase_form_error_alert_title')}</AlertTitle>
                   <AlertDescription>
                     {state.errors.general.join(', ')}
                   </AlertDescription>
                 </Alert>
               )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-glow" disabled={form.formState.isSubmitting || userBalance < finalPrice}>
              {form.formState.isSubmitting ? t('product_details_page.purchase_form_buy_button_processing') : `${t('product_details_page.purchase_form_buy_button_prefix')} ${finalPrice.toFixed(2)} ₽`}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
