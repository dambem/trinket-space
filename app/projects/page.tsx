import React from "react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import { forceSimulation, forceCenter, forceManyBody, forceCollide } from "d3";
import ProjectFlow from "app/components/connective_tissue";
import localFont from "next/font/local";
import Link from "next/link";
import ProjectFilters from "app/components/ui/projectpost";

const options = { next: { revalidate: 60 } };
const AdvercaseFont = localFont({
  src: "../font/AdvercaseFont.otf",
  variable: "--font-advercase",
  display: "swap",
});
const projects_QUERY = defineQuery(`*[
  _type == "project"
]{url, title, description, slug, blurb, start, end, cardSize,
  'status': status->{value, name},
  'tagMain': tagMain->{value, name, color},
  'tags': tags[] ->{value, name},
    'imageUrl': image.asset->url, year} | order(created desc)`);
const statuses_QUERY = defineQuery(`*[
  _type == "statusType"
]{
  value,
  name,
  color
} | order(name asc)`);
// Query to get main tags
const tagsMain_QUERY = defineQuery(`*[
  _type == "tagMainType"
]{
  name,
  value,
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
  const [projects, statuses, tags, mainTags] = await Promise.all([
    client.fetch(projects_QUERY, {}, options),
    client.fetch(statuses_QUERY, {}, options),
    client.fetch(tags_QUERY, {}, options),
    client.fetch(tagsMain_QUERY, {}, options),
  ]);

  return (
    <section className=" w-full px-4 md:px-6 ">
      <div className="flex main-section-min flex-col md:flex-row md:w-auto md:mx-[-35%] gap-8">
        <div className="w-full space-y-6">
          <div className="space-y-3">
            <h2 className={`${AdvercaseFont.className} text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200 bg-clip-text text-transparent`}>
              What i've worked on 
            </h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              A collection of experiments, failures, and breakthroughs.
            </p>
          </div>
          <ProjectFilters
            projects={projects}
            availableStatuses={statuses}
            availableTags={tags}
            availableMainTags={mainTags}
          />
        </div>
      </div>
    </section>
  );
}
