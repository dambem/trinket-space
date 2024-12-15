import React from "react";
import type { Metadata } from "next";
import ImageReact  from "app/components/image_react";
import Masonry from 'react-masonry-css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Photos",
  description: "My Photos",
};


export default function Photos() {
  return (
    <section>
      <ImageReact></ImageReact>
    </section>
  );
}
