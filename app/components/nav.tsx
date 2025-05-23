'use client';
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";
import { useState } from 'react';

const navItems = {
  "/": { name: "about me" },
  "/projects": { name: "projects" },
  "/writing ": { name: "writings" },
  // "/photos": { name: "photos" },
  // "/3d": { name: "3d works"}
};
  // "/3d": { name: "3d works"}
  //   "/code": { name: "code" },


export function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
      <header className="header">
            {/* <div className="scroll-progress"></div> */}

          <div className="header-content">
              <div className="avatar">
              <Image alt='spinning lamplight logo'
                 src={isPlaying ? "/lamplight-6.gif" : "/lamplight-static.png"} 
                 width={30}
                 height={30}
                 onMouseEnter={() => setIsPlaying(true)}
                 onMouseLeave={() => setIsPlaying(false)}
           
              ></Image>
              </div>
              <div className="header-text">
                <Link href="/" className="font-mono text-4xl tracking-tight">
                {metaData.title}
                </Link>
              </div>
          </div>
          
          <nav className="nav">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="nav-link"
              >
              {name}
              </Link> 
            ))}
          </nav>
      </header>
);
}


{/*     
    <nav id='nav-custom' className="lg:mb-8 mb-8 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Image alt='spinning lamplight logo' src= "/lamplight-6.gif" width={40} height={40} ></Image>
          <Link href="/" className="font-mono text-2xl tracking-tight">
              {metaData.title}
          </Link>
        </div>
        <div className="font-custom-mono flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
            >
            {name}
            </Link> 
          ))}
        </div>
      </div>
    </nav> */}