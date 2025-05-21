import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";
import { defineQuery, PortableText, type SanityDocument } from "next-sanity";
import { calculateReadingTime } from 'app/components/reading';

import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "app/sanity/client";
import Link from "next/link";
import Image from "next/image";
const options = { next: { revalidate: 60 } };


const EVENT_QUERY = defineQuery(`*[
  _type == "project" &&
  slug.current == $slug
][0]`);
const { projectId, dataset } = client.config();
// Query for random recommendation


export default async function Blog({ params }: {params: {slug: string}}) {
  const [event] = await Promise.all([
    client.fetch(EVENT_QUERY, params, options),
  ]);
  if (!event) {
    notFound();
  }
  const {
    post,
    name,
    slug
  } = event;
  return (
<main className="min-h-screen rounded pt-6 pr-6 pl-6 relative">
  {/* Background div with texture */}
  <div 
    className="absolute rounded-xl drop-shadow-lg	 inset-0 bg-stone-950 -z-10"
    style={{
      backgroundSize: '128px',
      backgroundImage:("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
    }}
  />
  
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight  text-yellow-200  text-gray-100">
            {name}
          </h1>
        </header>
      </div>
      
    </main>
  );
}