import Navbar from "@/widgets/navbar/Navbar";
import React from "react";
import { Outlet } from "react-router";

function Layout(): React.JSX.Element {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
