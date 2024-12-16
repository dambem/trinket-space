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
  _type == "post" &&
  slug.current == $slug
][0]`);
const { projectId, dataset } = client.config();
// Query for random recommendation
const RECOMMENDATIONS_QUERY = defineQuery(`*[
  _type == "post" &&
  slug.current != $slug
]`);


export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${metaData.baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: {params: {slug: string}}) {
  const [event, recommendations] = await Promise.all([
    client.fetch(EVENT_QUERY, params, options),
    client.fetch(RECOMMENDATIONS_QUERY, params, options)
  ]);
  if (!event) {
    notFound();
  }

  const recommendation = recommendations.length > 0 
  ? recommendations[Math.floor(Math.random() * recommendations.length)]
  : null;

  const {
    post,
    name,
    slug
  } = event;
  return (
<main className="min-h-screen relative">
  {/* Background div with texture */}
  <div 
    className="absolute inset-0 bg-black/90 -z-10"
    style={{
      backgroundImage: 'url(/noise.svg)',
      backgroundSize: '64px',
      filter: 'contrast(150%) brightness(150%) opacity(0.95)',
      backgroundBlendMode: 'overlay'
    }}
  />
  
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight  text-yellow-200  text-gray-100">
            {name}
          </h1>
          {/* You might want to add metadata here like date, reading time, etc */}
        </header>

        {/* Main content */}
        <article className="prose prose-quoteless prose-neutral dark:prose-invert
          prose-headings:text-gray-100
          prose-p:text-gray-300
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          max-w-none">
          <CustomMDX source={post} />
        </article>

        {recommendation && (
          <div className="mt-16 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Next Reading
            </h2>
            <Link
                className="flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80"
                href={`/writing/${recommendation?.slug?.current}`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <p className="text-black  dark:text-yellow-200 tracking-tight">
                    {recommendation.name}
                  </p>
  
                  <span className=" rounded  bg-yellow-300 px-2 py-1 text-xs font-medium text-neutral-900 ring-1 ring-inset ring-gray-500/10">
                    {recommendation.type}
                  </span>
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-200 tracking-tight">
                    {recommendation.snippet}
                </span>
                <div className="flex items-center text-xs text-neutral-600 space-x-4">
                  <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-xs">
                  {formatDate(recommendation.created)}
                  </span>
                <span  >
                  {calculateReadingTime(recommendation.post)} Minutes Reading
                </span>
                </div>
              </Link>
          </div>
        )}
      </div>
      
    </main>
  );
}