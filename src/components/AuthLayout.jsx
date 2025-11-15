import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    // This layout centers your auth forms on the page
    <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Outlet />
    </main>
  );
};

export default AuthLayout;