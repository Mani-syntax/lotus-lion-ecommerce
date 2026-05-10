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
          const cartItems = Array.isArray(state.cartItems) ? state.cartItems : [];
          const existItem = cartItems.find((x) => x.product === item.product);
          if (existItem) {
            return {
              cartItems: cartItems.map((x) =>
                x.product === existItem.product ? item : x
              ),
            };
          } else {
            return { cartItems: [...cartItems, item] };
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          const cartItems = Array.isArray(state.cartItems) ? state.cartItems : [];
          return {
            cartItems: cartItems.filter((x) => x.product !== id),
          };
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'lotus-lion-storage',
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<StoreState> | undefined;
        return {
          ...currentState,
          ...persisted,
          cartItems: Array.isArray(persisted?.cartItems) ? persisted.cartItems : [],
        };
      },
    }
  )
);
