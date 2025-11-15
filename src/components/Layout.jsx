import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar'; // Adjust path if Navbar is elsewhere

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet /> {/* Child routes (HomePage, Dashboard, etc.) render here */}
      </main>
    </>
  );
};

export default Layout;