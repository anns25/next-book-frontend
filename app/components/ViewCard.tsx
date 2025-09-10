'use client'
import { Box, Button, CircularProgress, Divider, Paper, Rating, Typography, useTheme } from "@mui/material";
import { Book } from "../types/Book";
import { useRouter } from "next/navigation";
import EditBookButton from "./EditBookButton";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useBook } from "../lib/swr";
import DeleteBookButton from "./DeleteBookButton";
import AddToCartButton from "./AddToCartButton";
type ViewCardProps = {
    bookId: string;
};
const ViewCard = ({ bookId }: ViewCardProps) => {
    const theme = useTheme();
    const router = useRouter(); // ✅ initialize router

    // use swr fetcher to fetch individual book

    const { data: book, error, isLoading } = useBook(bookId);




    // ✅ handle navigation
    const handleGoBack = () => {
        router.back();
    }


    // Show Loading state
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress size={60} />
            </Box>
        )
    }

    // show error state
    if (error || !book) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    gap: 2,
                }}
            >
                <Typography variant='h5' color="error">
                    Book Not Found
                </Typography>
                <Button variant="contained" onClick={handleGoBack}>Go Back</Button>
            </Box>
        )
    }

    const handleEditBook = async (updatedBook: Book) => {
        try {
            //Update  the SWR cache for the book list
            await mutate<Book[]>('/book/all', (prev = []) =>
                prev.map(b => b.book_id === updatedBook.book_id ? updatedBook : b),
                { revalidate: false }
            );

            //Update the SWR cache for individual book
            await mutate<Book>(`/book/view/${updatedBook.book_id}`, updatedBook, { revalidate: false });

            toast.success(`"${updatedBook.title}" has been updated successfully`);
        } catch (error) {
            console.log("Error handling book update : ", error);
            toast.error("Failed to update !");
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                p: { xs: 2, md: 5 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    maxWidth: 1200,
                    width: '100%',
                    backgroundColor: theme.palette.background.default,
                    p: 4,
                    gap: 4,
                }}
            >
                {/* Book Cover */}
                <Box
                    component="img"
                    src={`http://localhost:3000/uploads/${book.image}`}
                    alt={book.title}
                    sx={{
                        width: { xs: '100%', md: 300 },
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: 4,
                    }}
                />

                {/* Book Info */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h3" fontFamily={theme.typography.h1.fontFamily} color="primary.main">
                        {book.title}
                    </Typography>
                    <Typography variant="h5" fontFamily={theme.typography.h2.fontFamily} color="text.primary">
                        by {book.author}
                    </Typography>
                    <Typography variant="body1" fontFamily={theme.typography.body1.fontFamily} color="text.primary">
                        Genre: <strong>{book.genre}</strong>
                    </Typography>

                    <Rating name="read-only" value={book.rating || 0} precision={0.1} readOnly />
                    <Typography variant="body1" color="text.primary">
                        Price: ₹{book.price}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Summary
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontFamily={theme.typography.body1.fontFamily}>
                        {book.summary}
                    </Typography>
                    <Box>
                        <AddToCartButton book={book} />

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleGoBack()}
                            sx={{
                                mt: 3,
                                mr: 3,
                                ml: 3, 
                                alignSelf: 'flex-start',
                                fontFamily: theme.typography.body1.fontFamily,
                                boxShadow: 3,
                            }}
                        >
                            Go Back
                        </Button>
                        <EditBookButton book={book} onEditBook={handleEditBook} />
                        <DeleteBookButton book={book} />
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default ViewCard