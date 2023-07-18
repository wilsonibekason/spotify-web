"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  name: string;
  image: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ href, image, name }) => {
  const router = useRouter();
  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      className="relative group flex rounded-md items-center overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 cursor-pointer pr-4 transition"
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image src={image} alt={"Image"} className="object-cover" fill />
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div className="absolute transition opacity-0 rounded-full flex justify-center items-center bg-green-500 p-4 drop-shadow-md right-5 hover:opacity-100 hover:scale-110">
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};

export default ListItem;
// npx supabase gen types typescript --project-id usjrjvhcruffobamypwr --schema public > types/supabase_db.ts
