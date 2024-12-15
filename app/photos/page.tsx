import React from "react";
import type { Metadata } from "next";
import { ImageGrid } from "app/components/image-grid";
import Masonry from 'react-masonry-css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Photos",
  description: "My Photos",
};


export default function Photos() {
  const images = [
    { src: "/photos/3dprints/canary_wharf2.png", alt: "Roman columns" },
    { src: "/photos/3dprints/canary_wharf4.png", alt: "Big Ben" },
    { src: "/photos/3dprints/nyc1.png", alt: "Roman columns" },
    { src: "/photos/3dprints/oceanvillage1.png", alt: "Big Ben" },
    { src: "/photos/3dprints/southampton1.jpg", alt: "Sacré-Cœur Basilica" },
    { src: "/photos/opera.png", alt: "Sacré-Cœur Basilica" },
    { src: "/photos/3dprints/winchester1.png", alt: "Eiffel Tower" },
    { src: "/photos/3dprints/winchester7.png", alt: "Taj Mahal" },
    { src: "/photos/photo7.png", alt: "Canary Wharf" },
    { src: "/photos/tile.webp", alt: "Big Ben" },
  ];
  const breakpointColumns = {
    default: 4, // Default number of columns
    1536: 4,    // xl screens
    1280: 3,    // lg screens
    1024: 3,    // md screens
    768: 2,     // sm screens
    640: 1      // xs screens
  };
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">photos</h1>
      <ImageGrid images={images}></ImageGrid>
    </section>
  );
}
