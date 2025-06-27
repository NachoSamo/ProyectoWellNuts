import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="container my-4">
      {children || <Outlet />}
    </main>
  </>
);

export default Layout;
