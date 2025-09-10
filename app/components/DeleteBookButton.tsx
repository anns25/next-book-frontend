"use client";

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types/Book';
import { Delete } from '@mui/icons-material';
import { mutate } from 'swr';
import { deleteBook } from '../lib/api';
import { toast } from 'react-toastify';;
import { useRouter } from 'next/navigation';

interface DeleteBookButtonProps {
    book: Book;
}



const DeleteBookButton = ({ book }: DeleteBookButtonProps) => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const isOwner = !!user && !!book && book.creator === user._id;

    if (!user || user.role !== 'seller' || !isOwner) return null;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const success = await deleteBook(book._id);
            if (success) {
                // update swr cache
                await mutate<Book[]>(`/book/all`, (prev = []) =>
                    prev?.filter(b => b._id !== book._id),
                    { revalidate: false }
                );

                toast.success(`${book.title} has been deleted successfully !`);

                setOpen(false);

                setTimeout(() =>{
                    router.push("/");
                },1500);

            }
            else {
                throw new Error("Failed to delete book !");
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            toast.error("Failed to delete book. Please try again.")
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <Button
                sx={{ mt: 3, mr: 3 }}
                variant="contained"
                color="error"
                onClick={handleClickOpen}
            >
                Delete Book
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='delete-dialog-title'
                aria-describedby='delete-dialog-description'
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Book
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you suer you want to delete <strong>"{book.title}"</strong> by <strong>{book.author}</strong>. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <Box sx={{ width: 16, height: 16 }} /> : <Delete />}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default DeleteBookButton;