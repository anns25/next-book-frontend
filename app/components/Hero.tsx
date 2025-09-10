"use client";

import { alpha, Box, Container, Typography, useTheme } from "@mui/material";
import AddBookButton from "./AddBookButton";

export default function Hero() {
    const theme = useTheme();
    const onAddBook = (book: any) => {
    console.log('New book added:', book);
    // You can update your book list here or show a success message
  };
    

    return (
        <>


            {/* Welcome Section */}
            <Box textAlign="center" py={8} sx={{ mb: 5, position: 'relative', backgroundImage: 'url(https://images.unsplash.com/photo-1635621450236-da71ab3f362e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', transform: 'rotate(90)' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: alpha(theme.palette.secondary.main, 0.5), // translucent dark overlay
                        zIndex: 1,
                    }}
                />
                <Container sx={{ position: 'relative', backgroundColor: 'transparent', color: theme.palette.text.primary, pb: 5, zIndex: 2 }}>
                    <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: theme.typography.h1.fontFamily, mx: 'auto', maxWidth: '60%' }}>
                        Read.
                        Learn.
                        Grow.
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 4, fontFamily: theme.typography.body1.fontFamily }}>
                        Discover your next great read.
                    </Typography>
                    <AddBookButton onAddBook={ onAddBook} />

                </Container>
            </Box>
        </>

    );
}
