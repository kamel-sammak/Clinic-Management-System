import React from "react";
import Header from "../../shared/components/header/Header";
import Footer from "../../shared/components/footer/Footer";
import Admin from "./Admin";
import { Outlet } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <>
      <Header />
      <Admin />
      <Outlet />
      <Footer />
    </>
  );
}

export default AdminLayout;
