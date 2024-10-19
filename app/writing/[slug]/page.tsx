import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { metaData } from "app/config";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import Link from "next/link";
import Image from "next/image";

const options = { next: { revalidate: 60 } };

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  content,
  publishedAt,
  summary,
  image
}`);

const ALL_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`);

export async function generateStaticParams() {
  const slugs = await client.fetch(ALL_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug: slug.slug }));
}

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  const post = await client.fetch(POST_QUERY, { slug: params.slug }, options);
  if (!post) {
    return;
  }

  const { name: title, publishedAt, summary: description, image } = post;
  const ogImage = image
    ? image.url
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: publishedAt,
      url: `${metaData.baseUrl}/blog/${params.slug}`,
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

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = await client.fetch(POST_QUERY, { slug: params.slug }, options);
  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>{post.name}</h1>
      <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <CustomMDX source={post.content} />
      </article>
    </main>
  );
}