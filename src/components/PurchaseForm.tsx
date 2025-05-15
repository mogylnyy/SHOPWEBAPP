'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useActionState, useEffect, useState, startTransition } from 'react'; // Added startTransition
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
  login: z.string().min(1, 'Логин обязателен.'),
  password: z.string().min(1, 'Пароль обязателен.'),
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

  const currentFormSchema = showAuthFields
    ? purchaseFormSchemaBase.merge(authDetailsSchema).superRefine((data, ctx) => {
        if (!data.login) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['login'],
            message: t('product_details_page.purchase_form_login_label') + ' ' + t('zod.errors.required'),
          });
        }
        if (!data.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password'],
            message: t('product_details_page.purchase_form_password_label') + ' ' + t('zod.errors.required'),
          });
        }
      })
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

  // Destructure isPending from useActionState
  const [state, formAction] = useActionState<PurchaseFormState | undefined, FormData>(initiatePurchase, undefined);
  const [isPending, setIsPending] = useState(false);
  const [userBalance, setUserBalance] = useState(MOCK_USER_PROFILE.balance);

  useEffect(() => {
    if (product.requiresAuthDetails) {
      setShowAuthFields(true);
    }
  }, [product.requiresAuthDetails]);

  useEffect(() => {
    form.setValue('amount', finalPrice);
    form.setValue('subProductId', selectedSubProduct?.id);
    form.setValue('subProductName', selectedSubProduct?.name);
  }, [selectedSubProduct, finalPrice, form]);

  useEffect(() => {
    if (state?.success && state.redirectToPath) {
      toast({
        title: t('product_details_page.purchase_form_purchase_successful_title'),
        description: state.message,
      });
      router.push(state.redirectToPath);
      setUserBalance(currentBalance => currentBalance - finalPrice); // Update balance locally
    } else if (state?.message && !state.success) {
      const isInsufficientBalanceError = state.errors?.general?.includes(t('product_details_page.purchase_form_insufficient_balance_description'));
      toast({
        title: isInsufficientBalanceError ? t('product_details_page.purchase_form_insufficient_balance_title') : t('product_details_page.purchase_form_purchase_failed_title'),
        description: state.message,
        variant: 'destructive',
      });
      if(isInsufficientBalanceError){
        setTimeout(() => router.push(`/${locale}${PATHS.TOP_UP}`), 2000);
      }
    } else if (state?.errors && !state.success) {
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
    setIsPending(true);
    form.handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append('locale', locale);
      startTransition(() => {
        formAction(formData);
        setIsPending(false);
      });
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
            {/* Use isPending from useActionState for disabled and text state */}
            <Button type="submit" className="w-full btn-glow" disabled={isPending || userBalance < finalPrice}>
              {isPending ? t('product_details_page.purchase_form_buy_button_processing') : `${t('product_details_page.purchase_form_buy_button_prefix')} ${finalPrice.toFixed(2)} ₽`}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
