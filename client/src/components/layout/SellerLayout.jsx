import React from 'react';
import { Outlet } from 'react-router-dom';
import { SellerNavbar } from '../seller/SellerNavbar';
import { SellerSidebar } from '../seller/SellerSidebar';

export const SellerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <SellerNavbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <SellerSidebar />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
