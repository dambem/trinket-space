import React from "react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";

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
    <section className="w-full">
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      
      <div className="space-y-8">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-medium tracking-tight">
                  {project.title}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs tabular-nums">
                  {project.year}
                </span>
              </div>
              
              <div className="w-full">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="object-cover w-full h-full transition-all duration-300 grayscale hover:grayscale-0"
                  />
                </div>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
