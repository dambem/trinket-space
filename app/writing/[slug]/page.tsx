import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
// import { formatDate, getBlogPosts } from "app/lib/posts";
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
