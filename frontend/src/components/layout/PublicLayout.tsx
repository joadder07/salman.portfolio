import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020202] bg-[url('/images/dark-texture.jpg')] bg-cover bg-fixed bg-center bg-no-repeat text-foreground antialiased selection:bg-white selection:text-black">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
