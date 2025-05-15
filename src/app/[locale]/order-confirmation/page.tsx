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
  const { t } = useTranslation(undefined);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [hasCopiedOrder, setHasCopiedOrder] = useState(false);

  const orderIdFromUrl = searchParams.get('orderId');
  const productNameFromUrl = searchParams.get('productName');

  useEffect(() => {
    if (orderIdFromUrl !== orderId) {
      setOrderId(orderIdFromUrl);
    }
    if (productNameFromUrl !== productName) {
      setProductName(productNameFromUrl);
    }
  }, [orderIdFromUrl, productNameFromUrl, orderId, productName]);

  if (!orderId || !productNameFromUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  const decodedProductName = decodeURIComponent(productNameFromUrl);
  const message = `Здравствуйте! Я приобрел у вас товар: ${decodedProductName}.\nID заказа: ${orderId}\nТовар: ${decodedProductName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setHasCopiedOrder(true);
      toast({
        title: 'ID заказа скопирован',
        description: 'Данные заказа скопированы в буфер обмена.',
      });
    }).catch(err => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ID заказа',
        variant: 'destructive',
      });
    });
  };

  const handleGoToChat = () => {
    if (!hasCopiedOrder) {
      toast({
        title: 'Сначала скопируйте ID заказа!',
        description: '',
        variant: 'destructive',
      });
      return;
    }
    window.open('https://t.me/iimperium_support', '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
      <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-xl text-center w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">✅ Товар успешно оплачен!</h2>
        <div className="text-left text-sm bg-neutral-800 p-4 rounded-lg mb-4">
          <p><strong>🆔 ID заказа:</strong> {orderId}</p>
          <p><strong>📦 Товар:</strong> {decodedProductName}</p>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Скопируйте ID заказа и отправьте менеджеру.<br />
          После перехода в чат вставьте скопированный текст!
        </p>
        <button
          onClick={handleCopy}
          className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-lg text-white mb-3 w-full font-semibold transition"
        >
          📋 Скопировать ID заказа
        </button>
        <button
          onClick={handleGoToChat}
          className={`px-6 py-2 rounded-lg w-full font-semibold transition mb-1 ${
            hasCopiedOrder
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
          disabled={!hasCopiedOrder}
        >
          💬 Перейти в чат с менеджером
        </button>
      </div>
    </div>
  );
}


export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>{
      // Directly using Russian text for fallback as useTranslation isn't available here easily
      // In a more complex setup, this could be a global loading component or a simpler text
      "Загрузка..."
    }</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
