import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";

const navItems = {
  "/writing ": { name: "writings" },
  "/projects": { name: "projects" },
  "/photos": { name: "photos" },
  "/code": { name: "code" }
};
  // "/3d": { name: "3d works"}

export function Navbar() {
  return (
    <nav id='nav-custom' className="lg:mb-8 mb-8 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Image alt='spinning lamplight logo' src= "/lamplight-6.gif" width={40} height={40} ></Image>
          <Link href="/" className="font-mono text-2xl tracking-tight">
              {metaData.title}
          </Link>
        </div>
        <div className="font-mono flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
            >
            {name}
            </Link> 
          ))}
          {/* <ThemeSwitch /> */}
        </div>
      </div>
    </nav>
  );
}
