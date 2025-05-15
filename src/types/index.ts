export type SubProduct = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price?: number; // Optional if it has subProducts with prices
  category: string;
  image: string; // URL to product image
  subProducts?: SubProduct[];
  requiresAuthDetails?: boolean; // If true, prompts for login/pass/2FA
  dataAiHint?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string; // URL to category image
  dataAiHint?: string;
};

export type UserProfile = {
  id: string;
  username: string;
  balance: number;
  // other profile details
};

export type OrderDetails = {
  productId: string;
  productName: string;
  subProductId?: string;
  subProductName?: string;
  amount: number;
  userId: string;
  login?: string;
  password?: string;
  twoFactorEnabled?: boolean;
};
