import { NextResponse } from 'next/server';

function generateOrderId() {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampSuffix = Date.now().toString().slice(-4);
  return `ORD-${randomSuffix}-${timestampSuffix}`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Генерируем orderId и используем productName из запроса
    const orderId = generateOrderId();
    const productName = data.productName || '';
    // Возвращаем корректный redirectToPath
    return NextResponse.json({
      success: true,
      message: 'Покупка успешно оформлена!',
      redirectToPath: `/order-confirmation?orderId=${orderId}&productName=${encodeURIComponent(productName)}`,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: 'Ошибка на сервере: ' + (e as Error).message },
      { status: 500 }
    );
  }
} 