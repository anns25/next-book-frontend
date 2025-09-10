'use client';

import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/contexts/CartContext";
import Link from "next/link";

export default function Success() {
  const { clearCart } = useCart();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const clear = async () => {
      try {
        await clearCart();
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Failed to clear cart!");
      }
    };

    clear();
  }, [clearCart]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          textAlign: "center",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" color="primary" gutterBottom>
            Payment Successful
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
            Thank you for your purchase! Your order is confirmed and will be processed shortly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
