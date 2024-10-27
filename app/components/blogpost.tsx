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
                <h1 className="mb-8 text-2xl font-medium tracking-tight">Writings</h1>

<div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none focus:ring-0 transition-colors duration-200"
        />
      </div>
      
      <div className="relative min-w-[100px]">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <Filter size={18} />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white-200 dark:border-white-800 bg-white-50 dark:bg-zinc-900 py-2 pl-10 pr-8 text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none focus:ring-0 transition-colors duration-200"
        >
          {postTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
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