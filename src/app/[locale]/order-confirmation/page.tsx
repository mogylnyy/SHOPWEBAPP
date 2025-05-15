
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clipboard, MessageSquare } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation(searchParams.get('locale') as Locale || undefined); // Pass locale if available in params

  const [orderId, setOrderId] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [subProductName, setSubProductName] = useState<string | null>(null);
  const [hasCopiedOrder, setHasCopiedOrder] = useState(false);

  const orderIdFromUrl = searchParams.get('orderId');
  const productNameFromUrl = searchParams.get('productName');
  const subProductNameFromUrl = searchParams.get('subProductName'); // Исправлена опечатка здесь

  useEffect(() => {
    setOrderId(orderIdFromUrl);
    setProductName(productNameFromUrl);
    setSubProductName(subProductNameFromUrl);
  }, [orderIdFromUrl, productNameFromUrl, subProductNameFromUrl]);

  if (!orderId || !productNameFromUrl) { // Проверяем productNameFromUrl, т.к. productName стейт может быть еще не обновлен
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-muted-foreground">Загрузка информации о заказе...</p>
      </div>
    );
  }

  const decodedProductName = decodeURIComponent(productNameFromUrl); // Используем productNameFromUrl для декодирования
  const decodedSubProductName = subProductNameFromUrl ? decodeURIComponent(subProductNameFromUrl) : null;

  const fullProductName = decodedSubProductName ? `${decodedProductName} (${decodedSubProductName})` : decodedProductName;

  const messageToCopy = `Здравствуйте! Я приобрел у вас товар!

ID заказа: ${orderId}
Товар: ${fullProductName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageToCopy).then(() => {
      setHasCopiedOrder(true);
      toast({
        title: t('order_confirmation_page.copied_toast_title'),
        description: t('order_confirmation_page.copied_toast_description'),
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать текст. Пожалуйста, скопируйте вручную.",
        variant: "destructive"
      });
    });
  };

  const handleGoToChat = () => {
    if (!hasCopiedOrder) {
      toast({
        title: t('order_confirmation_page.copy_first_toast_title'),
        description: t('order_confirmation_page.copy_first_toast_description'),
        variant: 'destructive',
      });
      return;
    }
    window.open('https://t.me/iimperium_support', '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
      <Card className="w-full max-w-lg bg-card/90 backdrop-blur-lg shadow-xl border-border">
        <CardHeader className="text-center items-center pt-8">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">
            {t('order_confirmation_page.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-8 space-y-6">
          <div className="text-left text-base bg-background/50 p-4 rounded-lg border border-border/70 shadow-sm">
            <p className="mb-2"><strong className="text-muted-foreground">{t('order_confirmation_page.order_id_label')}</strong> <span className="font-mono text-accent">{orderId}</span></p>
            <p><strong>{t('order_confirmation_page.product_label')}</strong> <span className="font-medium">{fullProductName}</span></p>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 text-center">
            <p>{t('order_confirmation_page.copy_instructions_1')}</p>
            <p>{t('order_confirmation_page.copy_instructions_2')}</p>
          </div>

          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="w-full btn-glow border-primary hover:border-accent hover:bg-accent/10"
          >
            <Clipboard className="mr-2 h-5 w-5" />
            {t('order_confirmation_page.copy_button_text')}
          </Button>

          <Button
            onClick={handleGoToChat}
            size="lg"
            className={`w-full transition-all duration-200 font-semibold text-white
              ${hasCopiedOrder
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/50'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 hover:bg-muted'
              }`}
            disabled={!hasCopiedOrder}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            {t('order_confirmation_page.chat_button_text')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>Загрузка...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

