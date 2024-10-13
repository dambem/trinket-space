import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";
import { defineQuery, PortableText, type SanityDocument } from "next-sanity";

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
  const event = await client.fetch(EVENT_QUERY, params, options);
  if (!event) {
    notFound();
  }
  const {
    post,
    name,
    slug
  } = event;
  return (
    <main>
    <p>
      {name}
    </p>
    <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <CustomMDX source={post} />
      </article>
    </main>
  );
}
