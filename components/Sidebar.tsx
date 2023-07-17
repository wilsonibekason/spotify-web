"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import Sidebaritem from "./Sidebaritem";
import Library from "./Library";

interface ISidebar {
  children: React.ReactNode;
}

const Sidebar: React.FC<ISidebar> = ({ children }) => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname !== "/search",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: pathname === "/search",
        href: "/search",
      },
    ],
    [pathname]
  );
  return (
    <>
      <div className="flex h-full">
        <div className="hidden md:flex flex-col space-y-3 bg-black h-full w-[300px] p-2">
          <Box>
            <div className="flex flex-col gap-y-4 px-5 py-4">
              {routes.map((item) => (
                <Sidebaritem key={item.label} {...item} />
              ))}
            </div>
          </Box>
          <Box className="overflow-y-auto h-full">
            <Library />
          </Box>
        </div>
        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto py-2">{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
