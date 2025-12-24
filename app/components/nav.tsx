"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";
import { useState } from "react";
import localFont from "next/font/local";

const AdvercaseFont = localFont({
  src: "../font/AdvercaseFont.otf",
  variable: "--font-advercase",
  display: "swap",
});
const navItems = {
  "/": { name: "me & more" },
  "/projects": { name: "made & making" },
  // "/writing ": { name: "writings & bindings" },
  // "/sketches": { name: "sketches & snippets" },
  // "/talks": { name: "talks & events"}
  // "/photos": { name: "photos" },
  // "/3d": { name: "3d works"}
};

export function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <header className="header w-full pb-0 pt-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-5 mb-6">
          <div className="avatar">
            <Image
              alt="spinning lamplight logo"
              src={isPlaying ? "/lamplight-6.gif" : "/lamplight-static.png"}
              width={100}
              height={100}
              onMouseEnter={() => setIsPlaying(true)}
              onMouseLeave={() => setIsPlaying(false)}
            ></Image>
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className={`${AdvercaseFont.className} pt-4 tracking-wide text-2xl tracking-tight bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200 bg-clip-text text-transparent`}
            >
              {metaData.title}
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {Object.entries(navItems).map(([path, { name }], index) => (
                <span key={path} className="flex items-center">

                  {index > 0 && (
                    <span className="text-neutral-400 dark:text-neutral-600 mx-2 select-none">
                      /
                    </span>
                  )}
                  
                <Link key={path} href={path} className="nav-link">
                  {name}
                </Link>

                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
