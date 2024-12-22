'use client';

import { ImageGrid } from "app/components/image-grid";
import React, { useState } from "react";
import type { Metadata } from "next";
import { Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function ImageReact() {
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
        { src: "/photos/self-checkout.png", alt: "Big Ben" },
        { src: "/photos/selfcheckoutd.png", alt: "Big Ben" },
        { src: "/photos/3dprints/malta.png", alt: "Big Ben" },
      ];
    const [filterCount, setFilterCount] = useState(12); // Default to showing all images
    const [searchQuery, setSearchQuery] = useState('');
    const filteredImages = images.filter(image => 
        image.alt.toLowerCase().includes(searchQuery.toLowerCase())
      );
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium tracking-tight title">photos</h1>
        <div className="flex ml-10 z-10 space-x-4">
          <div  className="relative flex-grow">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-50">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-950 py-2 pl-10 pr-4 text-sm text-gray-50 dark:text-gray-50 placeholder:text-gray-50 dark:placeholder:text-gray-400 focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none focus:ring-0 transition-colors duration-200"
            />
          </div>
        </div>
    </div>
      <ImageGrid images={filteredImages}></ImageGrid>
    </section>
  );
}
