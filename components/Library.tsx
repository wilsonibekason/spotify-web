"use client";

import React from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import {toast} from "react-hot-toast";

const Library = () => {
  const { user } = useUser();
  const { onOpen } = useAuthModal();
  const uploadModal = useUploadModal();
  const handleOnclick = () => {
    if (!user) {
      // @ts-ignore
      return onOpen() && toast.error("Error, Issue should be addressed immediately")
    }
    return uploadModal.onOpen()
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="inline-flex gap-x-2 items-center text-neutral-400 font-medium">
          <TbPlaylist size={26} />
          <p>Library</p>
        </div>
        <AiOutlinePlus
          onClick={handleOnclick}
          className="text-neutral-400 hover:text-white cursor-pointer transition"
          size={20}
        />
      </div>
      {/*  */}
      <div className="flex flex-col gap-y-2 mt-4 px-3">Lists of songs</div>
    </div>
  );
};

export default Library;
