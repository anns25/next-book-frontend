"use client";

import React, { useState } from 'react';
import AddBookDrawer from './AddBookDrawer';
import { Button, Drawer } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types/Book';

interface AddBookButtonProps{
    onAddBook : (book : Book) => void;
}

const AddBookButton = ({onAddBook} : AddBookButtonProps) => {
    const { user } = useAuth();
    const [addDrawerOpen, setAddDrawerOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setAddDrawerOpen(newOpen);
    };

    if (!user || user.role !== 'seller') return null;

    return (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={toggleDrawer(true)}
            >
                Add Book
            </Button>
            <Drawer
                anchor="right"
                open={addDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <AddBookDrawer 
                    isOpen={addDrawerOpen} 
                    onClose={toggleDrawer(false)}
                />
            </Drawer>
        </>
    );
};

export default AddBookButton;