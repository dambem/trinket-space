'use client';

import React, { useState, useMemo } from 'react';
import Link from "next/link";
import { formatDate } from './dateformat';
import { calculateReadingTime } from './reading';

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

      <div className='grid place-content-end'>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md"
        />
        <br></br>
                <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          {postTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
          <br></br>
                <h1 className="mb-8 text-2xl font-medium tracking-tight">Writings</h1>

      <div>
        <ul>
          {filteredPosts.map((post) => (
            <li key={post._id}>
              <Link
                className="flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80"
                href={`/writing/${post?.slug?.current}`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <p className="text-black  dark:text-white tracking-tight">
                    {post.name}
                  </p>
  
                  <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {post.type}
                  </span>
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-200 tracking-tight">
                    {post.snippet}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-xs" >
                  {calculateReadingTime(post.post)} Minutes Reading
                </span>
                <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                  {formatDate(post.created)}
                </p>

              </Link>
            </li>
          ))}
        </ul>
        {filteredPosts.length === 0 && (
          <p className="text-neutral-600 dark:text-neutral-400">No posts found matching your search.</p>
        )}
      </div>
    </section>
  );
}