"use client";
import { useState } from 'react';
import { Button, Box, TextField, Typography, IconButton, Paper, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createBook } from '../lib/api';
import { Book, CreateBookData } from '../types/Book';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { mutate } from 'swr';
import { safeParse } from 'valibot';
import { bookSchema } from '../lib/validation/bookSchema';

interface AddBookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: any) => void;
}

export default function AddBookDrawer({ isOpen, onClose, onAddBook }: AddBookDrawerProps) {
  const [formValues, setFormValues] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    rating: "",
    summary: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleFieldChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    setLoading(false);
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please select an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }
      setImageFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));
      setLoading(false);
    }
  };

  //Remove selected Image

  const handleRemoveImage = () => {
    setImageFile(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: CreateBookData = {
      title: formValues.title,
      author: formValues.author,
      genre: formValues.genre,
      price: parseFloat(formValues.price),
      rating: parseFloat(formValues.rating),
      summary: formValues.summary,
      image: imageFile!
    };

    // ✅ Validate with Valibot
    const result = safeParse(bookSchema, data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.issues.forEach(issue => {
        const field = issue.path?.[0].key as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      console.log("errors", fieldErrors)

      if (isNaN(data.price)) {
        setErrors(prev => ({ ...prev, price: "Price is required." }));
      }

      if (isNaN(data.rating)) {
        setErrors(prev => ({ ...prev, rating: "Rating is required." }));
      }
      setLoading(false);
      return;
    }

    try {
      const book = await createBook(data);
      if (book) {
        // Optimistically update the SWR cache for '/book/all'
        await mutate<Book[]>('/book/all', (prev = []) => [book, ...prev], { revalidate: false });
        onClose();
        setFormValues({ title: "", author: "", genre: "", price: "", rating: "", summary: "" });
        setImageFile(null);
        setErrors({});
      } else {
        setErrors({ general: "Failed to add book. Please try again." });
      }
    } catch (err) {
      setErrors({ general: "Error adding book. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box sx={{ width: 360, p: 3, position: 'relative' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <IconButton sx={{ position: 'absolute', top: 8, left: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", pb: 2 }}>
          Add Book
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            name="title"
            label="Title"
            value={formValues.title}
            onChange={e => handleFieldChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />
          <TextField
            name="author"
            label="Author"
            value={formValues.author}
            onChange={e => handleFieldChange('author', e.target.value)}
            error={!!errors.author}
            helperText={errors.author}
            fullWidth
          />
          <TextField
            name="genre"
            label="Genre"
            value={formValues.genre}
            onChange={e => handleFieldChange('genre', e.target.value)}
            error={!!errors.genre}
            helperText={errors.genre}
            fullWidth
          />
          <TextField
            name="price"
            label="Price"
            value={formValues.price}
            onChange={e => handleFieldChange('price', e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            type="number"
          />
          <TextField
            name="rating"
            label="Rating"
            value={formValues.rating}
            onChange={e => handleFieldChange('rating', e.target.value)}
            error={!!errors.rating}
            helperText={errors.rating}
            fullWidth
            type="number"
          />
          <TextField
            name="summary"
            label="Summary"
            value={formValues.summary}
            onChange={e => handleFieldChange('summary', e.target.value)}
            error={!!errors.summary}
            helperText={errors.summary}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              Image
            </Typography>
            {imageFile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, mb: 2 }}>
                <Typography variant="body2" color={theme.palette.text.primary}>
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </Typography>
                <IconButton
                  color="error"
                  onClick={handleRemoveImage}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>) : (
              <Box sx={{ display: "flex", alignItems: 'center', mt: 2, gap: 2 }}>
                <Button
                  variant='outlined'
                  component="label"
                  color="primary"
                  startIcon={<PhotoCamera />}
                  sx={{ minWidth: 200 }}>
                  Choose Image
                  <input type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            )}

            {errors.image && (
              <Typography variant="caption" color="error">
                {errors.image}
              </Typography>
            )}
            {errors.general && (<Typography color="error">{errors.general}</Typography>)}
          </Box>

          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}