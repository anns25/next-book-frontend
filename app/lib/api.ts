import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "../types/User";
import axios from "./axios";
import { Book, CreateBookData, UpdateBookData } from "../types/Book";
import { getCookie } from "cookies-next";
import { CartResponse, AddToCartData, UpdateCartData } from "../types/Cart";


export async function createBook(bookData: CreateBookData): Promise<Book | null> {
    try {
        const token = getCookie("token");

        const formData = new FormData();
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('genre', bookData.genre);
        formData.append('price', bookData.price.toString());
        formData.append('rating', bookData.rating.toString());
        formData.append('summary', bookData.summary);
        formData.append('image', bookData.image);

        const response = await axios.post('http://localhost:3000/book/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 201) {
            return response.data.data; // Your backend returns { data: book, message: "..." }
        }

        console.log("response", response);
        return null;
    } catch (err) {
        console.error('Create book error:', err);
        throw err;
    }
}

export async function getBooks() {
    try {
        const res = await axios.get('http://localhost:3000/book/all');
        console.log("Books API Response:", res.data.data);
        if (res.status === 200) {
            return res.data.data;
        }

    } catch (err) {
        console.error(err);
        throw err;
    }

}

export async function getBookById(id: string) {
    try {
        const res = await axios.get(`http://localhost:3000/book/view/${id}`);
        console.log("response***", res);
        console.log("Book api response : ", res.data.data);
        if (res.status === 200) {
            return res.data.data;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateBook(bookData: UpdateBookData): Promise<Book | null> {
    try {
        const formData = new FormData();
        formData.append('id', bookData.id);

        if (bookData.title) formData.append('title', bookData.title);
        if (bookData.author) formData.append('author', bookData.author);
        if (bookData.genre) formData.append('genre', bookData.genre);
        if (bookData.price !== undefined) formData.append('price', bookData.price.toString());
        if (bookData.rating !== undefined) formData.append('rating', bookData.rating.toString());
        if (bookData.summary) formData.append('summary', bookData.summary);
        if (bookData.image) formData.append('image', bookData.image);

        const response = await axios.patch('http://localhost:3000/book/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            return response.data.data;
        }
        return null;
    } catch (err) {
        console.error('Update book error:', err);
        throw err;
    }
}

export async function deleteBook(id: string): Promise<boolean> {
    try {
        const response = await axios.delete('http://localhost:3000/book/delete', {
            data: { id: id } // Your backend expects { id: "..." } in body
        });
        return response.status === 200;
    } catch (err) {
        console.error('Delete book error:', err);
        throw err;
    }
}

//Authentication API functions
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
        const response = await axios.post('http://localhost:3000/user/login', credentials);
        if (response.status === 200) {
            return response.data;
        }
       
        return null;
    } catch (err: unknown) {
        console.error("Login error", err);
        return null;
    }
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse | null> {
    try {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);
        if (credentials.role) {
            formData.append('role', credentials.role);
        }
        formData.append('user_img', credentials.user_img);

        const response = await axios.post('http://localhost:3000/user/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if (response.status === 201) {
            return response.data;
        }
        return null;
    } catch (err) {
        console.error('Register error');
        return null;
    }
}


// Cart API functions


export async function getCart(): Promise<CartResponse | null> {
    try {
        const token = getCookie("token");
        const response = await axios.get('http://localhost:3000/cart/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Get cart error:', err);
        throw err;
    }
}

export async function addToCart(data: AddToCartData): Promise<CartResponse | null> {
    try {
        const token = getCookie("token");
        const response = await axios.post('http://localhost:3000/cart/add', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Add to cart error:', err);
        throw err;
    }
}

export async function updateCartItem(data: UpdateCartData): Promise<CartResponse | null> {
    try {
        const token = getCookie("token");
        const response = await axios.patch('http://localhost:3000/cart/update', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Update cart error:', err);
        throw err;
    }
}

export async function removeFromCart(bookId: string): Promise<CartResponse | null> {
    try {
        const token = getCookie("token");
        const response = await axios.delete('http://localhost:3000/cart/delete', {
            data: { bookId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Remove from cart error:', err);
        throw err;
    }
}

export async function clearCart(): Promise<CartResponse | null> {
    try {
        const token = getCookie("token");
        const response = await axios.delete('http://localhost:3000/cart/clear', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Clear cart error:', err);
        throw err;
    }
}
