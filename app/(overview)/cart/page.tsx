"use client";

import React, { useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Rating,
    Grid
} from '@mui/material';

import { Remove, Add, Delete, ShoppingCartCheckout } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/app/contexts/AuthContext';


export default function CartPage() {
    const theme = useTheme();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const stripePromise = loadStripe("pk_test_51Rxhu2Rpd1q4ZABJa5DE2cD3KQ2NoMcd7NRd9JPETjwOPB2np5zGDtVEjT3vj9vzWTbdvH4sLUO3WnV1xa0rVNrh00ZQ2dXOUr");
    const {
        cartItems,
        loading,
        totalItems,
        totalPrice,
        shipping,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    // redirect to Login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    })

    const handleCheckout = async () => {
        try {
            await stripePromise;
            const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // redirect to Stripe Checkout
            }
        } catch (error) {
            console.error("Error redirecting to checkout:", error);
        }
    };

    //show loading while checking authentication

    if (authLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}>
                <CircularProgress size={60} />
            </Box>
        )
    }

    // Don't render anything if not authenticated 
    if(!user){
        return null;
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    minHeight: '100vh',
                    p: { xs: 2, md: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography variant="h4" color="text.secondary">
                    Your cart is empty
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Add some books to get started!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/')}
                    sx={{ mt: 2 }}
                >
                    Browse Books
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                p: { xs: 2, md: 5 },
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" fontFamily={theme.typography.h1.fontFamily}>
                        Shopping Cart ({totalItems} items)
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearCart}
                        startIcon={<Delete />}
                    >
                        Clear Cart
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {cartItems.map((item) => (
                            <Card key={item._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 120, height: 160, objectFit: 'cover' }}
                                            image={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                                            alt={item.title}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" fontFamily={theme.typography.h2.fontFamily}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                by {item.author}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Genre: {item.genre}
                                            </Typography>
                                            <Rating
                                                value={item.rating}
                                                precision={0.1}
                                                readOnly
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                                ₹{item.price}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                >
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Items ({totalItems})</Typography>
                                <Typography>₹{totalPrice}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Shipping</Typography>
                                <Typography>{shipping === 0 ? "Free" : `₹${shipping}`}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">₹{totalPrice}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                startIcon={<ShoppingCartCheckout />}
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}