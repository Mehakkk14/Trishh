import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WISHLIST'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

const initialState: WishlistState = {
  items: [],
  loading: false,
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_WISHLIST':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user } = useAuth();

  // Load wishlist from localStorage or Firebase when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        dispatch({ type: 'SET_WISHLIST', payload: [] });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Try to load from localStorage first (for immediate UX)
        const localWishlist = localStorage.getItem(`wishlist_${user.uid}`);
        if (localWishlist) {
          const items = JSON.parse(localWishlist);
          dispatch({ type: 'SET_WISHLIST', payload: items });
        }

        // TODO: Sync with Firebase in future
        // For now, just using localStorage
        
      } catch (error) {
        console.error('Error loading wishlist:', error);
        dispatch({ type: 'SET_WISHLIST', payload: [] });
      }
    };

    loadWishlist();
  }, [user]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (user && state.items.length >= 0) {
      localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const addToWishlist = (item: WishlistItem) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    if (state.items.find(i => i.id === item.id)) {
      toast({
        title: "Already in wishlist",
        description: "This item is already in your wishlist",
        variant: "destructive",
      });
      return;
    }

    const itemWithTimestamp = {
      ...item,
      addedAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ITEM', payload: itemWithTimestamp });
    toast({
      title: "Added to wishlist",
      description: `${item.name} has been added to your wishlist`,
    });
  };

  const removeFromWishlist = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  const isInWishlist = (itemId: string) => {
    return state.items.some(item => item.id === itemId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    if (user) {
      localStorage.removeItem(`wishlist_${user.uid}`);
    }
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  return (
    <WishlistContext.Provider value={{
      state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;