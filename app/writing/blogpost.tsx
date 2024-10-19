'use client';

import React, { useState } from 'react';
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
    let currentDate = new Date();
    if (!date.includes("T")) {
      date = `${date}T00:00:00`;
    }
    let targetDate = new Date(date);
  
    let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
    let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
    let daysAgo = currentDate.getDate() - targetDate.getDate();
  
    let formattedDate = "";
  
    if (yearsAgo > 0) {
      formattedDate = `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
      formattedDate = `${monthsAgo}mo ago`;
    } else if (daysAgo > 0) {
      formattedDate = `${daysAgo}d ago`;
    } else {
      formattedDate = "Today";
    }
  
    let fullDate = targetDate.toLocaleString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    if (!includeRelative) {
      return fullDate;
    }
  
    return `${fullDate} (${formattedDate})`;
  }

export default function BlogPostsClient({ posts }: BlogPostsClientProps) {
  const [query, setQuery] = useState("");

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Writings</h1>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Add any filtering UI here if needed */}
      </div>
      <div>
        <ul>
          {posts.map((post) => (
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
      </div>
    </section>
  );
}
