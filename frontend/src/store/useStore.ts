import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
  isAdmin: boolean;
  token: string;
}

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

interface StoreState {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existItem = state.cartItems.find((x) => x.product === item.product);
          if (existItem) {
            return {
              cartItems: state.cartItems.map((x) =>
                x.product === existItem.product ? item : x
              ),
            };
          } else {
            return { cartItems: [...state.cartItems, item] };
          }
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((x) => x.product !== id),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'lotus-lion-storage',
    }
  )
);
