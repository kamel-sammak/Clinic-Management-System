import React from "react";
import Header from "../../shared/components/header/Header";
import Footer from "../../shared/components/footer/Footer";
import { Outlet } from "react-router-dom";
import Doctor from "./Doctor";

function DoctorLayout() {
  return (
    <>
      <Header />
      <Doctor />
      <Outlet />
      <Footer />
    </>
  );
}

export default DoctorLayout;
