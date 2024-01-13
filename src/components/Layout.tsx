import React, { ReactNode } from "react";
import BottomTab from "@/components/BottomTab";
import Sidebar from "@/components/Sidebar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for web, hidden on mobile */}
      <div className="hidden md:flex md:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto">{children}</div>

      {/* BottomTab for mobile, hidden on web */}
      <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
        <BottomTab />
      </div>
    </div>
  );
};

export default Layout;
