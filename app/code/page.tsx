'use client';
// https://damians-mapping-feature.streamlit.app/
import React from "react";
import type { Metadata } from "next";
// import { projects } from "./project-data";
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import imageUrlBuilder from '@sanity/image-url'
import {Frameset, Frame} from 'react-frame-component'

const metadata: Metadata = {
  title: "Code",
  description: "Code Snippet",
};
const options = { next: { revalidate: 60 } };

const projects_QUERY = defineQuery(`*[
  _type == "project"
]{url, title, description,  'imageUrl': image.asset->url,  year} | order(created desc)`);

export default async function Code() {
  const projects = await client.fetch(projects_QUERY, {}, options);
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      <div className="space-y-6">
        <Frameset>
            <Frame>

            </Frame>
        </Frameset>

      </div>
    </section>
  );
}
