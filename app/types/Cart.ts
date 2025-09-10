export type CartItem = {
    _id: string;
    title: string;
    author: string;
    genre: string;
    price: number;
    rating: number;
    image: string;
    summary: string;
    quantity: number;
};

export type CartApiItem = {
    bookId : Omit<CartItem, 'quanity'>;
    quantity: number;
}

export type Cart = {
    userId: string;
    items: CartApiItem[];
};

export type CartResponse = {
    data: Cart;
    message: string;
};

export type AddToCartData = {
    bookId: string;
    quantity: number;
};

export type UpdateCartData = {
    bookId: string;
    quantity: number;
};