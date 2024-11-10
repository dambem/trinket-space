import React from "react";
import type { Metadata } from "next";
import { ImageGrid } from "app/components/image-grid";

export const metadata: Metadata = {
  title: "Photos",
  description: "My Photos",
};

export default function Photos() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Photos</h1>
      <ImageGrid
        columns={3}
        images={[
          { src: "/photos/3dprints/canary_wharf2.png", alt: "Roman columns" },
          { src: "/photos/3dprints/canary_wharf4.png", alt: "Big Ben" },
          { src: "/photos/tile.webp", alt: "Big Ben" },
        ]}
      />
      <ImageGrid
        columns={4}
        images={[
          { src: "/photos/3dprints/nyc1.png", alt: "Roman columns" },
          { src: "/photos/3dprints/oceanvillage1.png", alt: "Big Ben" },
          { src: "/photos/3dprints/southampton1.jpg", alt: "Sacré-Cœur Basilica" },
          { src: "/photos/opera.png", alt: "Sacré-Cœur Basilica" },

        ]}
      />
      <ImageGrid
        columns={3}
        images={[
          { src: "/photos/3dprints/winchester1.png", alt: "Eiffel Tower" },
          { src: "/photos/3dprints/winchester7.png", alt: "Taj Mahal" },
          { src: "/photos/photo7.png", alt: "Canary Wharf" },
        ]}
      />
    </section>
  );
}
