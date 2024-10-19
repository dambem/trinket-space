'use client';

import React, { useState, useMemo } from 'react';
import Link from "next/link";

interface Post {
  _id: string;
  name: string;
  created: string;
  type: string;
  slug: { current: string };
  typeTitle: string;
}

interface BlogPostsClientProps {
  posts: Post[];
}

function formatDate(date: string, includeRelative = false) {
  // ... (keep the existing formatDate function)
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
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
                <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {postTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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
                  <p className="text-black dark:text-white tracking-tight">
                    {post.name}
                  </p>
                  <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {post.type}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                  {post.created}
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