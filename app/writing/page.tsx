import BlogPostsClient from 'app/components/blogpost'
import { client } from "app/sanity/client";
import { defineQuery } from "next-sanity";

const options = { next: { revalidate: 60 } };

const posts_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, name, created, type, slug, 'typeTitle': type.title
} | order(created desc)`);

export default async function BlogPosts() {
  const posts = await client.fetch(posts_QUERY, {}, options);
  return <BlogPostsClient posts={posts} />;
}
