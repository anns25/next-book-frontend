"use client";

import React, { useState } from 'react';
import { Button, IconButton, Box, Grid, useTheme, Typography } from '@mui/material';
import { AddShoppingCart, Remove, Add } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { Book } from '../types/Book';

interface AddToCartButtonProps {
    book: Book;
    variant?: 'button' | 'icon';
    size?: 'small' | 'medium' | 'large';
}

const AddToCartButton = ({ book, variant = 'button', size = 'medium' }: AddToCartButtonProps) => {
    const { addToCart, updateQuantity, cartItems } = useCart();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const cartItem = cartItems.find(item => item._id === book._id);
    const isInCart = !!cartItem;

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await addToCart(book); // Now accepts Book directly
        } finally {
            setLoading(false);
        }
    };

    const handleIncreaseQuantity = async () => {
        if (cartItem) {
            setLoading(true);
            try {
                await updateQuantity(book._id, cartItem.quantity + 1);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDecreaseQuantity = async () => {
        if (cartItem) {
            setLoading(true);
            try {
                await updateQuantity(book._id, cartItem.quantity - 1);
            } finally {
                setLoading(false);
            }
        }
    };

    if (variant === 'icon') {
        return (
            <IconButton
                color="primary"
                onClick={handleAddToCart}
                disabled={loading}
                size={size}
            >
                <AddShoppingCart />
            </IconButton>
        );
    }

    if (isInCart) {
        return (

            // <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, mr: 3 }}>
            //     <Button
            //         variant="outlined"
            //         size="small"
            //         onClick={handleDecreaseQuantity}
            //         disabled={loading}
            //         sx={{maxWidth: 40}}
            //     >
            //         <Remove />
            //     </Button>
            //     <Box sx={{ maxWidth: 40, textAlign: 'center' }}>
            //         {cartItem.quantity}
            //     </Box>
            //     <Button
            //         variant="outlined"
            //         size="small"
            //         onClick={handleIncreaseQuantity}
            //         disabled={loading}
            //         sx={{maxWidth: 40}}
            //     >
            //         <Add />
            //     </Button>
            // </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mr: 3, ml: 3 }}>
                <IconButton
                    onClick={handleDecreaseQuantity}
                    sx={{ color: theme.palette.primary.main }}
                >
                    <Remove />
                </IconButton>
                <Typography mx={1}>{cartItem.quantity}</Typography>
                <IconButton
                    onClick={handleIncreaseQuantity}
                    sx={{ color: theme.palette.primary.main }}
                >
                    <Add />
                </IconButton>
            </Box>


        );
    }

    return (

        <Button
            variant="contained"
            color="secondary"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            disabled={loading}
            size={size}
            sx={{
                mt: 3,
                alignSelf: 'flex-start',
                fontFamily: 'Lora',
                boxShadow: 3,
            }}
        >
            {loading ? 'Adding...' : 'Add to Cart'}
        </Button>

    );
};

export default AddToCartButton;