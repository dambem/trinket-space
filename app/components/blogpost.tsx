'use client';

import React, { useState, useMemo } from 'react';
import Link from "next/link";
import { formatDate } from './dateformat';
import { calculateReadingTime } from './reading';
import { Search, Filter } from 'lucide-react';

interface Post {
  _id: string;
  name: string;
  created: string;
  type: string;
  snippet: string;
  slug: { current: string };
  typeTitle: string;
  post: string;
}

interface BlogPostsClientProps {
  posts: Post[];
}

export default function BlogPostsClient({ posts }: BlogPostsClientProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const postTypes = useMemo(() => {
    const types = new Set(posts.map(post => post.type));
    return ["All", ...Array.from(types)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      (selectedType === "All" || post.type === selectedType) &&
      (post.name.toLowerCase().includes(query.toLowerCase()) ||
       post.type.toLowerCase().includes(query.toLowerCase()))
    );
  }, [posts, query, selectedType]);

  return (
    <section>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium tracking-tight">writings</h1>
        <div className="flex ml-10 space-x-4">
          <div  className="relative flex-grow">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-50">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-950 py-2 pl-10 pr-4 text-sm text-gray-50 dark:text-gray-50 placeholder:text-gray-50 dark:placeholder:text-gray-400 focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none focus:ring-0 transition-colors duration-200"
            />
          </div>
          <div className="relative min-w-[100px]">

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full appearance-none border border-neutral-200 dark:border-neutral-600 dark:bg-neutral-950 py-2 pl-5 pr-6 text-sm text-yellow-900 dark:text-gray-50 focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none focus:ring-0 transition-colors duration-200"
          >
            {postTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>
      <div>
        <ul>
          {filteredPosts.map((post) => (
            <article className="border-t border-white-500 pt-6 hover:bg-gray-800 transition p-6 -mx-6">

            <li key={post._id}>
              <Link
                className="flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80"
                href={`/writing/${post?.slug?.current}`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <p className="text-black  dark:text-yellow-200 tracking-tight">
                    {post.name}
                  </p>
  
                  <span className="rounded-md bg-yellow-300 px-2 py-1 text-xs font-medium text-neutral-900 ring-1 ring-inset ring-gray-500/10">
                    {post.type}
                  </span>
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-200 tracking-tight">
                    {post.snippet}
                </span>
                <div className="flex items-center text-xs text-neutral-600 space-x-4">
                  <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-xs">
                  {formatDate(post.created)}
                  </span>
                <span  >
                  {calculateReadingTime(post.post)} Minutes Reading
                </span>
                </div>
              </Link>
            </li>
            </article>
          ))}
        </ul>
        {filteredPosts.length === 0 && (
          <p className="text-neutral-600 dark:text-neutral-400">No posts found matching your search.</p>
        )}
      </div>
    </section>
  );
}