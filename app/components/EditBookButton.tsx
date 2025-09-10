"use client";

import React, { useState } from 'react';
import { Button, Drawer } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import EditBookDrawer from './EditBookDrawer';
import { Book } from '../types/Book';

interface EditBookButtonProps{
    book : Book;
    onEditBook : (book : any) => void;
}

const EditBookButton = ({book, onEditBook} : EditBookButtonProps) => {
    const { user } = useAuth();
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setEditDrawerOpen(newOpen);
    };

    const isOwner = !!user && !!book && book.creator === user._id;

    if (!user || user.role !== 'seller' || !isOwner) return null;

    return (
        <>
            <Button
                sx={{mt: 3, mr: 3}} 
                variant="contained" 
                color="primary" 
                onClick={toggleDrawer(true)}
            >
                Edit Book
            </Button>
            <Drawer
                anchor="right"
                open={editDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <EditBookDrawer 
                    isOpen={editDrawerOpen} 
                    onClose={toggleDrawer(false)}
                    onUpdateBook = {onEditBook} 
                    book={book}
                />
            </Drawer>
        </>
    );
};

export default EditBookButton;