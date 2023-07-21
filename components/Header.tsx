"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const { onOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // TODO
    router.refresh();
    error
      ? toast.error(error.message, { duration: 2000 })
      : toast.success(`${user?.email} successfully Logged Out`);
  };

  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-800 p-6",
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            type="button"
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
            onClick={() => router.back()}
          >
            <RxCaretLeft size={35} color="white" />
          </button>
          {/*  */}
          <button
            type="button"
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
            onClick={() => router.forward()}
          >
            <RxCaretRight size={35} color="white" />
          </button>
        </div>
        {/*Mobile Components  */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        {/*  */}
        <div className="flex justify-between items-center gap-x-4 font-medium">
          {user ? (
            <>
              <div className="flex gap-x-3 items-center">
                <Button className="text-red-700" onClick={handleLogout}>
                  Logout
                </Button>
                <Button
                  onClick={() => router.push("/account")}
                  className="bg-white"
                >
                  <FaUserAlt />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={onOpen}
                className="bg-transparent text-neutral-300 whitespace-nowrap"
              >
                Sign up
              </Button>
              <Button
                onClick={onOpen}
                className="bg-white px-6 py-3 text-black"
              >
                Log In
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
