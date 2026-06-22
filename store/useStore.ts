import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  deposit: number;
  items: CartItem[];
  status: 'Processing' | 'Assigned' | 'Ready for Pick-Up' | 'Completed';
  branch: string;
  branchId: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  assignedTo?: string;
  review?: number;
  userId?: string;
  customerEmail?: string;
  deliveryNotes?: string;
}

export interface AppNotification {
  id: string;
  orderId: string;
  message: string;
  date: string;
  read: boolean;
  type: 'status_update' | 'system';
  userId?: string;
}

interface StoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cart: CartItem[];
  savedForLater: CartItem[];
  theme: 'light' | 'dark';
  language: 'en' | 'fr' | 'rw';
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'fr' | 'rw') => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], assignedTo?: string) => void;
  addReview: (orderId: string, rating: number) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  branchInventory: Record<string, Record<string, number>>;
  decreaseInventory: (branchId: string, items: CartItem[]) => void;
  isEvaluationMode: boolean;
  setEvaluationMode: (val: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategory: 'All',
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      cart: [],
      savedForLater: [],
      theme: 'light',
      language: 'en',
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      isEvaluationMode: false,
      setEvaluationMode: (isEvaluationMode) => set({ isEvaluationMode }),
      addToCart: (product, qty = 1) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: qty }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      saveForLater: (productId) =>
        set((state) => {
          const item = state.cart.find((i) => i.id === productId);
          if (!item) return state;
          return {
            cart: state.cart.filter((i) => i.id !== productId),
            savedForLater: [...(state.savedForLater || []), item],
          };
        }),
      moveToCart: (productId) =>
        set((state) => {
          const item = (state.savedForLater || []).find((i) => i.id === productId);
          if (!item) return state;
          
          const existingCartItem = state.cart.find((i) => i.id === productId);
          const newCart = existingCartItem
            ? state.cart.map((i) =>
                i.id === productId ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            : [...state.cart, item];

          return {
            savedForLater: (state.savedForLater || []).filter((i) => i.id !== productId),
            cart: newCart,
          };
        }),
      removeFromSaved: (productId) =>
        set((state) => ({
          savedForLater: (state.savedForLater || []).filter((i) => i.id !== productId),
        })),
      toggleTheme: () =>
        set((state) => {
          if (typeof window !== 'undefined') localStorage.setItem('theme-user-choice', 'true');
          return { theme: state.theme === 'light' ? 'dark' : 'light' };
        }),
      setTheme: (theme) => {
        if (typeof window !== 'undefined') localStorage.setItem('theme-user-choice', 'true');
        set({ theme });
      },
      setLanguage: (language) => set({ language }),
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      notifications: [],
      markNotificationAsRead: (id) => set((state) => ({
        notifications: (state.notifications || []).map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: (state.notifications || []).map((n) => ({ ...n, read: true }))
      })),
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...(state.orders || [])] })),
      updateOrderStatus: (orderId, status, assignedTo) =>
        set((state) => {
          const order = (state.orders || []).find((o) => o.id === orderId);
          const newNotifications = [...(state.notifications || [])];
          if (status === 'Ready for Pick-Up' || status === 'Completed') {
            newNotifications.unshift({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              orderId,
              message: `Your order #${orderId.slice(-4)} is now ${status}.`,
              date: new Date().toISOString(),
              read: false,
              type: 'status_update',
              userId: order?.userId
            });
          }
          return {
            orders: (state.orders || []).map((o) =>
              o.id === orderId ? { ...o, status, ...(assignedTo !== undefined ? { assignedTo } : {}) } : o
            ),
            notifications: newNotifications,
          };
        }),
      addReview: (orderId, rating) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, review: rating } : o
          ),
        })),
      branchInventory: {},
      decreaseInventory: (branchId, items) =>
        set((state) => {
          const currentBranchInv = state.branchInventory[branchId] || {};
          const newBranchInv = { ...currentBranchInv };
          items.forEach((item) => {
            const currentStock = newBranchInv[item.id] ?? 50; // default 50 stock if undefined
            newBranchInv[item.id] = Math.max(0, currentStock - item.quantity);
          });
          return {
            branchInventory: { ...state.branchInventory, [branchId]: newBranchInv }
          };
        }),
    }),
    {
      name: 'simba-store',
      partialize: (state) => ({
        cart: state.cart,
        savedForLater: state.savedForLater,
        language: state.language,
        theme: state.theme,
        wishlist: state.wishlist,
        orders: state.orders,
        branchInventory: state.branchInventory,
        notifications: state.notifications
      }),
    }
  )
);
