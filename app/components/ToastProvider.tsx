// app/components/ToastProvider.tsx
"use client";

import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

export default function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 1600 }} 
      />
    </>
  );
}