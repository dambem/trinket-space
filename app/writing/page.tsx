import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";

export const metadata = {
  title: "Writing",
  description: "Latarnia Blog",
};

const options = { next: { revalidate: 60 } };


const posts_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, name, created, slug}`);


export default async function BlogPosts() {
  let allBlogs = getBlogPosts();
  const posts = await client.fetch(posts_QUERY, {}, options);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Writings</h1>
      <div>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link
              key={post.slug}
              className="flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80"
              href={`/writing/${post?.slug?.current}`}
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-black dark:text-white tracking-tight">
                  {post.name}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                  {formatDate(post.created, false)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
