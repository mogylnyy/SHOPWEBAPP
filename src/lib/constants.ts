
import type { Category, Product, UserProfile } from '@/types';

export const APP_NAME = 'ИИMPERIUM SHOP'; // Changed from QuickBuy TG

export const PATHS = {
  HOME: '/',
  SHOP: '/shop',
  PROFILE: '/profile',
  TOP_UP: '/top-up',
  HELP: '/help',
};

// Mock Data
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    description: 'Доступ к мощным ИИ-моделям и инструментам.', // Translated
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzQ3MjkxOTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'AI technology',
  },
  {
    id: 'proxies',
    name: 'Proxies',
    description: 'Безопасные и анонимные прокси-серверы.', // Translated
    image: 'https://images.unsplash.com/photo-1604005366359-2f8f2a044336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxuZXR3b3JrJTIwc2VydmVyfGVufDB8fHx8MTc0NzI5MTk4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'network server',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Продвинутый ИИ-ассистент от OpenAI.', // Translated
    category: 'neural-networks',
    image: 'https://placehold.co/600x400.png', // Changed from Unsplash
    dataAiHint: 'ChatGPT logo', // Changed from 'AI chat'
    requiresAuthDetails: false,
    subProducts: [
      { id: 'plus-subscription-renewal', name: 'Продление подписки Plus', price: 20 },
      { id: 'plus-account-ready', name: 'Готовый аккаунт Plus', price: 25 },
      { id: 'pro-subscription-renewal', name: 'Продление подписки PRO', price: 45 },
      { id: 'pro-account-ready', name: 'Готовый аккаунт PRO', price: 50 },
      { id: 'basic-account', name: 'Аккаунт без подписки', price: 5 },
    ],
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    description: 'Разговорная поисковая система и ИИ-ассистент для исследований.', // Translated
    category: 'neural-networks',
    image: 'https://placehold.co/600x400.png', // Using placeholder
    dataAiHint: 'AI brain', // Updated hint based on user's image
    price: 25,
    requiresAuthDetails: false,
  },
  {
    id: 'residential-proxy',
    name: 'Residential Proxy Pack',
    description: 'High-anonymity residential proxies.',
    category: 'proxies',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'network connection',
    price: 25,
    requiresAuthDetails: false,
  },
  {
    id: 'datacenter-proxy',
    name: 'Datacenter Proxy',
    description: 'Fast datacenter proxies for various tasks.',
    category: 'proxies',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'data center',
    subProducts: [
      { id: 'dc-10', name: '10 Datacenter Proxies', price: 10 },
      { id: 'dc-50', name: '50 Datacenter Proxies', price: 40 },
    ],
  },
  {
    id: 'premium-vpn',
    name: 'Premium VPN Subscription',
    description: '1-year premium VPN access.',
    category: 'vpn', // This category was removed from MOCK_CATEGORIES earlier
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'VPN lock',
    price: 60,
    requiresAuthDetails: true,
  },
   {
    id: 'steam-account',
    name: 'Steam Account (CS2 Prime)',
    description: 'Steam account with CS2 Prime status.',
    category: 'game-accounts', // This category was removed from MOCK_CATEGORIES earlier
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'video game',
    price: 35,
    requiresAuthDetails: false,
  },
];

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user123',
  username: 'QuickBuyer',
  balance: 150.75,
};

export const LAVA_IO_TOP_UP_URL = 'https://lava.io/pay';
export const LAVA_IO_QR_CODE_IMAGE = 'https://placehold.co/256x256.png';
export const ADMIN_TELEGRAM_BOT_ID = 'YOUR_ADMIN_BOT_ID';
export const ADMIN_TELEGRAM_CHAT_ID = 'YOUR_ADMIN_CHAT_ID';

