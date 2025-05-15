'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { MOCK_USER_PROFILE, ADMIN_TELEGRAM_BOT_ID, ADMIN_TELEGRAM_CHAT_ID, PATHS } from './constants';
import type { OrderDetails } from '@/types';

// Simulate backend API calls
async function checkUserBalance(userId: string, amount: number): Promise<boolean> {
  // const user = await fetch(`/api/users/${userId}/balance`).then(res => res.json());
  // return user.balance >= amount;
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return MOCK_USER_PROFILE.balance >= amount;
}

async function processPayment(userId: string, amount: number): Promise<boolean> {
  // await fetch(`/api/transactions`, { method: 'POST', body: JSON.stringify({ userId, amount }) });
  await new Promise(resolve => setTimeout(resolve, 500));
  // For mock, reduce balance
  MOCK_USER_PROFILE.balance -= amount;
  return true;
}

async function recordOrder(orderDetails: OrderDetails): Promise<string> {
  // const order = await fetch(`/api/orders`, { method: 'POST', body: JSON.stringify(orderDetails) }).then(res => res.json());
  // return order.id;
  await new Promise(resolve => setTimeout(resolve, 500));
  return `mock_order_${Date.now()}`;
}

async function sendTelegramNotification(message: string): Promise<void> {
  console.log(`TELEGRAM NOTIFICATION TO ADMIN (${ADMIN_TELEGRAM_CHAT_ID} via ${ADMIN_TELEGRAM_BOT_ID}): ${message}`);
  // In a real app, use a Telegram Bot API library or fetch:
  // const telegramApiUrl = `https://api.telegram.org/bot${ADMIN_TELEGRAM_BOT_ID}/sendMessage`;
  // await fetch(telegramApiUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ chat_id: ADMIN_TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' }),
  // });
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
});

export type PurchaseFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    [key: string]: string[] | undefined;
    general?: string[];
  };
  orderId?: string;
  redirectToChat?: boolean;
};

export async function initiatePurchase(
  prevState: PurchaseFormState | undefined,
  formData: FormData
): Promise<PurchaseFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  // Convert amount to number and twoFactorEnabled to boolean
  const processedFormData = {
      ...rawFormData,
      amount: parseFloat(rawFormData.amount as string),
      twoFactorEnabled: rawFormData.twoFactorEnabled === 'on' || rawFormData.twoFactorEnabled === 'true',
  };

  const validatedFields = purchaseFormSchema.safeParse(processedFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { productId, productName, subProductId, subProductName, amount, login, password, twoFactorEnabled } = validatedFields.data;
  const userId = MOCK_USER_PROFILE.id; // Get from auth session in real app

  try {
    // 1. Balance Check
    const hasSufficientBalance = await checkUserBalance(userId, amount);
    if (!hasSufficientBalance) {
      // This redirect should ideally happen client-side before form submission,
      // but server-side check is a fallback.
      // For a better UX, client-side check + server-side re-validation is preferred.
      // redirect(PATHS.TOP_UP); // Next.js Server Actions redirect
      return {
        message: 'Insufficient balance. Please top up your account.',
        success: false,
        errors: { general: ['Insufficient balance. Please top up your account. Redirecting... (simulated)'] }
        // Consider adding a specific field to indicate redirect for client-side handling
      };
    }

    // 2. Process Payment (simulated)
    const paymentSuccessful = await processPayment(userId, amount);
    if (!paymentSuccessful) {
      return { message: 'Payment processing failed.', success: false };
    }

    // 3. Record Order
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

    // 4. Admin Notification
    const notificationMessage = `
      New Purchase!
      --------------------
      User ID: ${userId}
      Product: ${productName}${subProductName ? ` (${subProductName})` : ''}
      Amount: $${amount.toFixed(2)}
      Order ID: ${orderId}
      ${login ? `Login: ${login}` : ''}
    `.trim().replace(/^      /gm, '');
    await sendTelegramNotification(notificationMessage);
    
    // 5. Success: Redirect to chat or provide confirmation
    // This example simulates a redirect to an embedded chat.
    // In a real scenario, you might redirect to a specific URL or return data to show a success message.
    return {
      message: `Purchase successful! Order ID: ${orderId}. You will be redirected to chat.`,
      success: true,
      orderId,
      redirectToChat: true, // This flag can be used by the client to handle redirection
    };

  } catch (error) {
    console.error('Purchase error:', error);
    return {
      message: 'An unexpected error occurred during purchase.',
      success: false,
      errors: { general: ['An unexpected server error occurred.'] }
    };
  }
}
