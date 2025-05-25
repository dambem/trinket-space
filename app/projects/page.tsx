import React from 'react';
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import { motion, AnimatePresence } from 'framer-motion';
import { forceSimulation, forceCenter, forceManyBody, forceCollide } from 'd3';
// import ProjectClock from 'app/components/project_clock';
// export const metadata: Metadata = {
//   title: "Projects",
//   description: "My Projects",
// };
import ProjectFlow from 'app/components/connective_tissue';

import Link from "next/link";
import ProjectFilters from 'app/components/ui/projectpost';

const options = { next: { revalidate: 60 } };

const projects_QUERY = defineQuery(`*[
  _type == "project"
]{url, title, description, slug,
  'status': status->{value, name},
  'tags': tags[] ->{value, name},
    'imageUrl': image.asset->url, year} | order(created desc)`);
const statuses_QUERY = defineQuery(`*[
  _type == "statusType"
]{
  value,
  name,
  color
} | order(name asc)`);

// Query to get all available tags
const tags_QUERY = defineQuery(`*[
  _type == "tagType"
]{
  name,
  value,
  color
} | order(name asc)`);

export default async function Projects() {
  const [projects, statuses, tags] = await Promise.all([
    client.fetch(projects_QUERY, {}, options),
    client.fetch(statuses_QUERY, {}, options),
    client.fetch(tags_QUERY, {}, options)
  ]);
  console.log(statuses)
  console.log(tags)

  return (
      <section className=" w-full px-4 md:px-6 ">
        <h1 className="mb-8 text-2xl font-medium tracking-tight title">projects</h1>

        <div className="flex main-section-min flex-col md:flex-row w-screen md:w-auto md:mx-[-35%] gap-8">

        <div className="w-full">
        <h2 className="mb-8 text-2xl font-medium tracking-tight title-left" >a list of projects i've made/contributed to -  </h2>
        <p>all variations of finished, ongoing, paused, or failed - click on a project to see the skills, and the (often hard) lessons learned</p>
        {/* <p> I'm happy to chat about any of these - especially t</p> */}
        <ProjectFilters 
              projects={projects}
              availableStatuses={statuses}
              availableTags={tags}
            />

        {/* <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-3 gap-6"> */}

          {/* {projects.map((project, index) => (
            <Link
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
                  <p>{project.status?.name}</p>
                  <p>{project.tags?.name}</p>
                </div>
                
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>
              
            </Link>
          ))} */}
        {/* </div> */}

        </div>
        {/* <div className="w-full md:w-1/2"> */}
          {/* <h2 className="mb-8 text-2xl font-medium tracking-tight title" >Project Flow</h2> */}
          {/* <ProjectFlow/>
        </div> */}

        {/* <div className="w-full md:w-1/2">
            <ProjectClock />
        </div> */}
        </div>
      </section>
    );
}
              // href={`/projects/${project.slug?.current}`}
