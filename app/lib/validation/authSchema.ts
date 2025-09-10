import { object, string, minLength, nonEmpty, pipe, email, custom } from 'valibot';

export const loginSchema = object({
    username: pipe(string(),  minLength(3, 'Username must have at least 3 characters'), nonEmpty('Username is required')),
    password: pipe(string(),  minLength(3, 'Password must be at least 3 characters'), nonEmpty('Password is required')),
});

export const signupSchema = object({
    username: pipe(string(),  minLength(3, 'Username must have at least 3 characters'), nonEmpty('Username is required'),),
    password: pipe(string(), minLength(3, 'Password must be at least 3 characters'),  nonEmpty('Password is required'),),
    email: pipe(string(),  email('Must be a valid email address'), nonEmpty('Email is required'),),
    image: custom(
    (file) => file instanceof File && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024,
    'Profile image is required and must be an image less than 5MB'),
});




