import React from "react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import { motion, AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: "Projects",
  description: "My Projects",
};

const options = { next: { revalidate: 60 } };

const projects_QUERY = defineQuery(`*[
  _type == "project"
]{url, title, description, 'imageUrl': image.asset->url, year} | order(created desc)`);

export default async function Projects() {
  const projects = await client.fetch(projects_QUERY, {}, options);
  
  return (
    <section className="w-full px-4 md:px-6">
      <h1 className="mb-8 text-2xl font-medium tracking-tight title">projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded  drop-shadow-md  block bg-transparent	 overflow-hidden shadow-sm hover:shadow-md hover:bg-stone-950 transition-shadow duration-300"
          >
            <div className="relative aspect-video">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 grayscale group-hover:grayscale-0 transform group-hover:scale-105"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-baseline mb-3">
                <h2 className="font-medium  text-yellow-200 tracking-tight truncate">
                  {project.title}
                </h2>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs tabular-nums shrink-0 ml-2">
                  {project.year}
                </span>
              </div>
              
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
