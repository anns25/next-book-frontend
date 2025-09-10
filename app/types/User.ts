export type User = {
    _id: string;
    username: string;
    email: string;
    role: 'seller' | 'buyer';
    user_img: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type LoginCredentials = {
    username : string;
    password: string;
};

export type RegisterCredentials = {
    username : string;
    email : string;
    password : string;
    role?: 'seller' | 'buyer';
    user_img: File;
};

export type AuthResponse = {
    data: string; //JWT token
    user: User;
    message: string;
}