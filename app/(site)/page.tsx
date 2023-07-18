import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-neutral-900 w-full h-full overflow-y-auto overflow-hidden">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-2xl font-semibold">
              (Wilson Ibekason) Welcome back{" "}
            </h1>
            {/*  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4"></div>
            <ListItem
              image="/images/liked.png"
              href="liked"
              name="Liked Songs"
            />
          </div>
        </Header>
        <div className="mt-2 mb-7 px-6">
          <div className="flex justify-between items-center">
            <p className="text-white text-2xl font-medium">Newest Songs</p>
          </div>
        </div>
        <div>New Songs</div>
      </div>
    </>
  );
}
