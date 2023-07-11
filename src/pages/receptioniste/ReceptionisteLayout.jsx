import React from "react";
import { Outlet } from "react-router-dom";
import Receptioniste from "./Receptioniste";
import Header from "../../shared/components/header/Header";
import Footer from "../../shared/components/footer/Footer";

function ReceptionisteLayout() {
  return (
    <>
      <Header />
      <Receptioniste />
      {/* <div className="admin-content">{children}</div> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default ReceptionisteLayout;
