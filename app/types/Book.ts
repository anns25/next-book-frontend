export type Book = {
    _id: string;
    book_id: string;
    title: string;
    author: string;
    genre: string;
    price: number;
    rating: number;
    image: string;
    summary: string;
    is_deleted: boolean;
    creator: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateBookData = {
    title: string;
    author: string;
    genre: string;
    price: number;
    rating: number;
    summary: string;
    image: File | string;
};

export type UpdateBookData = {
    id: string;
    title?: string;
    author?: string;
    genre?: string;
    price?: number;
    rating?: number;
    summary?: string;
    image?: File;
};

export type BookResponse = {
    data: Book;
    message: string;
};

export type BooksResponse = {
    data: Book[];
    message: string;
};