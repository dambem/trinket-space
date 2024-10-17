import React from "react";
import type { Metadata } from "next";
// import { projects } from "./project-data";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import imageUrlBuilder from '@sanity/image-url'


export const metadata: Metadata = {
  title: "Projects",
  description: "My Projects",
};
const options = { next: { revalidate: 60 } };

const projects_QUERY = defineQuery(`*[
  _type == "project"
]{url, title, description,  'imageUrl': image.asset->url,  year} | order(created desc)`);

export default async function Projects() {
  const projects = await client.fetch(projects_QUERY, {}, options);
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group hover:opacity-80 transition-opacity duration-200"
          >
            <div className="flex flex-col ">
              <div className="w-full flex justify-between items-baseline ">
                <span className="text-black dark:text-white font-medium tracking-tight">
                  {project.title}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                  {project.year}
                </span>
              </div>
              <div>
              <img className="w-full rounded max-h-20 object-cover mr-4 grayscale hover:grayscale-0" src={project.imageUrl}></img> 
              <span className="w-2/3 prose prose-neutral dark:prose-invert pt-3">
                {project.description}
              </span>
              </div>
            </div>

          </a>
        ))}
      </div>
    </section>
  );
}
