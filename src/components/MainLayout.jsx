import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar'; // Adjust path if Navbar is elsewhere

const MainLayout = () => {
  return (
    <>
      <Navbar />
      {/* The 'main' tag is still here, but with NO padding.
        Your HomePage and Footer components will now control their own width.
      */}
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default MainLayout;