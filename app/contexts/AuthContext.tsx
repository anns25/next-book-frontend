"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/User';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { loginUser, registerUser } from '../lib/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const checkAuth = () => {
    try {
      const userData = getCookie('userData');

      if (userData) {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      deleteCookie('userData');
      deleteCookie('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await loginUser(credentials);
      console.log("response", response);
      if (response) {
        //Store token and user data in cookies (client-side)
        setCookie('token', response.data, { maxAge: 60 * 60 * 24 });
        setCookie('userData', JSON.stringify(response.user), { maxAge: 60 * 60 * 24 });
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error: unknown) {
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await registerUser(credentials);
      if (response) {
        //Store token and user data in cookies (client side)
        setCookie('token', response.data, { maxAge: 60 * 60 * 24 });
        setCookie('userData', response.user, { maxAge: 60 * 60 * 24 });
        setUser(response.user);
        toast.success("New User Created");
        setError('');
        return true;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'registration failed');
      } else {
        setError('An unexpected error occurred');
      }
      toast.error("Registration failed", { className: 'error-toast' });
      return false;
    }
  };

  const logout = async () => {
    router.push('/login');
    deleteCookie('token');
    deleteCookie('userData');
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}