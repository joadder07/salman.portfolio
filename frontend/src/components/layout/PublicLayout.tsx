import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-grunge text-foreground antialiased selection:bg-white selection:text-black">
      <Header />
      <main className="flex-1 w-full bg-dark-grunge">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
