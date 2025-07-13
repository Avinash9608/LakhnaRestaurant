export type MenuItem = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  category: string;
  dataAiHint: string;
  modelColor: string;
};

export type PopularItem = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dataAiHint: string;
  tags: string[];
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};
