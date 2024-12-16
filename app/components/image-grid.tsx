'use client';

import React, {useState} from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Masonry from 'react-masonry-css';
import { X, ZoomIn, Info } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const masonryStyles = `
.my-masonry-grid {
  display: flex;
  width: auto;
  gap: 16px;
}
.my-masonry-grid_column {
  background-clip: padding-box;
}
`;
interface ImageGridProps {
  images: {
    src: string;
    alt: string;
    href?: string;
  }[];
  columns?: 2 | 3 | 4; // Accepts 2, 3, or 4 columns
}

export const ImageGrid = ({ images }) => {
  const breakpointColumns = {
    default: 4, // Default number of columns
    1536: 4,    // xl screens
    1280: 3,    // lg screens
    1024: 3,    // md screens
    768: 2,     // sm screens
    640: 1      // xs screens
  };
  return (
    <motion.div 
    layout
  >
    <PhotoProvider>
      <style>{masonryStyles}</style>
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((image, index) => (
          <div key={index} className="mb-4">
              <motion.div
              key={image.src}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.2,
                layout: { duration: 0.3 }
              }}
              className=""
            >
            <PhotoView src={image.src}>
            <div className="cursor-zoom-in">
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={400}
              className="rounded-lg"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            </div>
            </PhotoView>
            </motion.div>
          </div>
        ))}
      </Masonry>
    </PhotoProvider>
    </motion.div>
  );
};
