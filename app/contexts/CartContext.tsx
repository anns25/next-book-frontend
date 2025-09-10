"use client";

import React, { createContext, useContext, useEffect, useReducer, ReactNode, useCallback } from 'react';
import { CartItem } from '../types/Cart';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../lib/api';
import { toast } from 'react-toastify';
import { Book } from '../types/Book';
import { useAuth } from './AuthContext';
import { getCookie } from 'cookies-next';

interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
}

type CartAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const initialState: CartState = {
    cartItems: [],
    loading: false,
    error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'SET_CART':
            return { ...state, cartItems: action.payload, loading: false, error: null };

        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item._id === action.payload._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
                };
            }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload),
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item._id === action.payload.bookId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        case 'CLEAR_CART':
            return { ...state, cartItems: [] };

        default:
            return state;
    }
}

interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalPrice: number;
    shipping: number;
    fetchCart: () => Promise<void>;
    addToCart: (book: Book) => Promise<void>;
    updateQuantity: (bookId: string, quantity: number) => Promise<void>;
    removeFromCart: (bookId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        try {
            // check if user is authenticated and token exists
            const token = getCookie("token");
            if (!user || !token) {
                dispatch({ type: 'SET_CART', payload: [] });
                return;
            }
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await getCart();

            if (response?.data?.items) {
                const items = response.data.items as Array<{ bookId: CartItem; quantity: number}>
                const formattedItems = items.map(({bookId, quantity}) => ({
                    ...bookId,
                    quantity,
                }));
                dispatch({ type: 'SET_CART', payload: formattedItems });
            } else {
                dispatch({ type: 'SET_CART', payload: [] });
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            //If its a 403 error, clear the cart instead of showing error
            if (error instanceof Error && error.message.includes('403')) {
                dispatch({ type: 'SET_CART', payload: [] });
            } else {
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
            }
        }
    },[user]);

    const addToCartHandler = async (book: Book) => {
        try {
            await addToCart({ bookId: book._id, quantity: 1 });
            //Convert Book to CartItem by adding quantity
            const cartItem: CartItem = {
                ...book,
                quantity: 1,
            }
            dispatch({ type: 'ADD_TO_CART', payload: cartItem });
            toast.success('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const updateQuantityHandler = async (bookId: string, quantity: number) => {
        try {
            if (quantity <= 0) {
                await removeFromCartHandler(bookId);
                return;
            }

            await updateCartItem({ bookId, quantity });
            dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } });
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const removeFromCartHandler = async (bookId: string) => {
        try {
            await removeFromCart(bookId);
            dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
            toast.success('Removed from cart!');
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove from cart');
        }
    };

    const clearCartHandler = async () => {
        try {
            await clearCart();
            dispatch({ type: 'CLEAR_CART' });
            toast.success('Cart cleared!');
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const subtotal = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shipping = (subtotal < 500) ? 20 : 0;

    const totalItems = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = Number(
        (subtotal + shipping).toFixed(2)
    );


    useEffect(() => {
        //Only fetch cart of user is authenticated
        if (user) {
            fetchCart();
        }
        else {
            dispatch({ type: 'CLEAR_CART' });
        }
    }, [user]);

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                loading: state.loading,
                error: state.error,
                totalItems,
                totalPrice,
                shipping,
                fetchCart,
                addToCart: addToCartHandler,
                updateQuantity: updateQuantityHandler,
                removeFromCart: removeFromCartHandler,
                clearCart: clearCartHandler,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}