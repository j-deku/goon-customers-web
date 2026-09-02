// src/user/components/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Forms from "../Forms/Forms";
import { Helmet } from "react-helmet-async";

export default function MainLayout({ login, setLogin }) {
  return (
    <>
      <Helmet>
        <title>GoOn</title>
      </Helmet>
      {login && <Forms setLogin={setLogin} />}    
      <Navbar setLogin={setLogin} />
      <div className="app">
        <Outlet />
      </div>
      <Footer />
    </>
  ); 
}
