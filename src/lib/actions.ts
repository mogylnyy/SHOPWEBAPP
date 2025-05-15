
'use server';

import { z } from 'zod';
// import { redirect } from 'next/navigation'; // Not used for now for client-side redirect handling
import { MOCK_USER_PROFILE, ADMIN_TELEGRAM_BOT_ID, ADMIN_TELEGRAM_CHAT_ID, PATHS } from './constants';
import type { OrderDetails } from '@/types';
import type { Locale } from './i18n-config'; // For potential localized messages from action
import { getTranslations } from './i18n-server'; // For localized messages

// Simulate backend API calls
async function checkUserBalance(userId: string, amount: number): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_USER_PROFILE.balance >= amount;
}

async function processPayment(userId: string, amount: number): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_USER_PROFILE.balance -= amount;
  return true;
}

async function recordOrder(orderDetails: OrderDetails): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Generate orderId in ORD-XXXX-YYYY format
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampSuffix = Date.now().toString().slice(-4);
  return `ORD-${randomSuffix}-${timestampSuffix}`;
}

async function sendTelegramNotification(message: string): Promise<void> {
  console.log(`TELEGRAM NOTIFICATION TO ADMIN (${ADMIN_TELEGRAM_CHAT_ID} via ${ADMIN_TELEGRAM_BOT_ID}): ${message}`);
  await new Promise(resolve => setTimeout(resolve, 300));
}

const purchaseFormSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  subProductId: z.string().optional(),
  subProductName: z.string().optional(),
  amount: z.number().positive(),
  login: z.string().optional(),
  password: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  locale: z.string(), // For localized messages
});

export type PurchaseFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    [key: string]: string[] | undefined;
    general?: string[];
  };
  orderId?: string;
  productName?: string;
  subProductName?: string;
  redirectToPath?: string;
};

export async function initiatePurchase(
  prevState: PurchaseFormState | undefined,
  formData: FormData
): Promise<PurchaseFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const processedFormData = {
      ...rawFormData,
      amount: parseFloat(rawFormData.amount as string),
      twoFactorEnabled: rawFormData.twoFactorEnabled === 'on' || rawFormData.twoFactorEnabled === 'true',
      locale: rawFormData.locale as Locale || 'ru', // Default to 'ru' if not provided
  };

  const validatedFields = purchaseFormSchema.safeParse(processedFormData);
  const { t } = await getTranslations(processedFormData.locale as Locale);


  if (!validatedFields.success) {
    return {
      message: t('product_details_page.purchase_form_invalid_data_message'),
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { productId, productName, subProductId, subProductName, amount, login, password, twoFactorEnabled } = validatedFields.data;
  const userId = MOCK_USER_PROFILE.id;

  try {
    const hasSufficientBalance = await checkUserBalance(userId, amount);
    if (!hasSufficientBalance) {
      return {
        message: t('product_details_page.purchase_form_insufficient_balance_description'),
        success: false,
        errors: { general: [t('product_details_page.purchase_form_insufficient_balance_description')] } // Use translated message
      };
    }

    const paymentSuccessful = await processPayment(userId, amount);
    if (!paymentSuccessful) {
      return { message: t('product_details_page.purchase_form_purchase_failed_title'), success: false }; 
    }

    const orderDetails: OrderDetails = {
      productId,
      productName,
      subProductId,
      subProductName,
      amount,
      userId,
      login,
      password,
      twoFactorEnabled,
    };
    const orderId = await recordOrder(orderDetails);

    const notificationMessage = `
Новая покупка!
--------------------
ID Пользователя: ${userId}
Товар: ${productName}${subProductName ? ` (${subProductName})` : ''}
Сумма: ${amount.toFixed(2)} ₽
ID Заказа: ${orderId}
${login ? `Логин: ${login}` : ''}
    `.trim().replace(/^      /gm, '');
    await sendTelegramNotification(notificationMessage);
    
    const redirectPath = `/${validatedFields.data.locale}${PATHS.ORDER_CONFIRMATION}?orderId=${orderId}&productName=${encodeURIComponent(productName)}${subProductName ? `&subProductName=${encodeURIComponent(subProductName)}` : ''}`;

    return {
      message: `${t('product_details_page.purchase_form_purchase_successful_title')} ID Заказа: ${orderId}. Вы будете перенаправлены.`,
      success: true,
      orderId,
      productName: productName,
      subProductName: subProductName,
      redirectToPath: redirectPath, 
    };

  } catch (error) {
    console.error('Purchase error:', error);
    return {
      message: t('product_details_page.purchase_form_generic_error_message'),
      success: false,
      errors: { general: [t('product_details_page.purchase_form_generic_error_message')] }
    };
  }
}
