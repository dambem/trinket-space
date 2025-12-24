import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate } from "app/lib/posts";
import { metaData } from "app/config";
import { defineQuery, type SanityDocument } from "next-sanity";
import { calculateReadingTime } from "app/components/reading";
import { client } from "app/sanity/client";
import Link from "next/link";
import Image from "next/image";

const options = { next: { revalidate: 60 } };

const PROJECT_QUERY = defineQuery(`*[
  _type == "project" &&
  slug.current == $slug
][0]{
  post,
  name,
  slug,
  title,
  description,
  year,
  url,
  skillsLearned,
  'status': status->{value, title, color},
  'tags': tags[] ->{value, title, color},
  'techStack': techStack[] ->{value, title, color},
  'imageUrl': image.asset->url,
  created
}`);

// Query for random project recommendation
const RECOMMENDATIONS_QUERY = defineQuery(`*[
  _type == "project" &&
  slug.current != $slug
]{
  name,
  slug,
  title,
  description,
  year,
  'status': status->{value, name, color},
  'tags': tags[] ->{value, name, color},
  'imageUrl': image.asset->url,
  created
}`);

export async function generateStaticParams() {
  const projects = await client.fetch(
    defineQuery(`*[_type == "project"]{slug}`),
    {},
    options
  );

  return projects.map((project: any) => ({
    slug: project.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const project = await client.fetch(PROJECT_QUERY, params, options);

  if (!project) {
    return;
  }

  const { title, description, year } = project;

  const projectTitle = title;
  const ogImage = project.imageUrl
    ? project.imageUrl
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(projectTitle)}`;

  return {
    title: `${projectTitle} (${year}) - Projects`,
    description: description || `${projectTitle} - A project from ${year}`,
    openGraph: {
      title: projectTitle,
      description: description || `${projectTitle} - A project from ${year}`,
      type: "article",
      url: `${metaData.baseUrl}/projects/${project.slug.current}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: projectTitle,
      description: description || `${projectTitle} - A project from ${year}`,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const [project, recommendations] = await Promise.all([
    client.fetch(PROJECT_QUERY, params, options),
    client.fetch(RECOMMENDATIONS_QUERY, params, options),
  ]);

  if (!project) {
    notFound();
  }

  const recommendation =
    recommendations.length > 0
      ? recommendations[Math.floor(Math.random() * recommendations.length)]
      : null;

  const {
    post,
    name,
    title,
    description,
    year,
    url,
    skillsLearned,
    status,
    tags,
    techStack,
    imageUrl,
    created,
  } = project;

  const projectTitle = title || name;

  return (
    <main className="min-h-screen rounded pt-6 pr-6 pl-6 relative">
      <div className="main-section-min max-w-3xl mx-auto">
        {/* Header section */}
        <header className="mb-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-yellow-200 text-gray-100">
              {projectTitle}
            </h1>

            {/* Project meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                {year}
              </span>

              {status && (
                <span
                  className="rounded px-2 py-1 text-xs font-medium text-neutral-900 ring-1 ring-inset ring-gray-500/10"
                  style={{ backgroundColor: "#fde047" }}
                >
                  {status.title}
                </span>
              )}

              <Link 
                href={"/projects"}>
                <span className="text-blue-400 hover:text-blue-300 text-xs">
                  Back to Projects
                </span>
              </Link>

              {url && (
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  View Project →
                </Link>
              )}
              
            </div>

            {/* Tags and Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag: any) => (
                <span
                  key={tag.value}
                  className="rounded px-2 py-1 text-xs text-neutral-900 ring-1 ring-inset ring-gray-500/10"
                  style={{ backgroundColor: tag.color || "#e5e7eb" }}
                >
                  {tag.title}
                </span>
              ))}
            </div>
            <div>
              {techStack?.map((tech: any) => (
                <span
                  key={tech.value}
                  className="rounded px-2 py-1 text-xs bg-blue-100 text-blue-900 ring-1 ring-inset ring-blue-500/10"
                  style={{ backgroundColor: tech.color || "#dbeafe" }}
                >
                  {tech.title}
                </span>
              ))}
            </div>
            {description && (
              <p className="text-gray-300 text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </header>

        {/* Project image */}
        {imageUrl && (
          <div className="mb-8">
            <Image
              src={imageUrl}
              alt={projectTitle}
              width={800}
              height={400}
              className="rounded-lg w-full object-cover"
            />
          </div>
        )}

        {/* Main content */}
        <article
          className="prose prose-quoteless prose-neutral dark:prose-invert
          prose-headings:text-gray-100
          prose-p:text-gray-300
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          max-w-none"
        >
          {post && <CustomMDX source={post} />}
        </article>

        {/* Skills learned section */}
        {skillsLearned && (
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Skills Learned
            </h2>
            <p className="text-gray-300 leading-relaxed">{skillsLearned}</p>
          </div>
        )}

        {/* Recommendation section */}
        {recommendation && (
          <div className="mt-16 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Another Project
            </h2>
            <Link
              className="flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80"
              href={`/projects/${recommendation?.slug?.current}`}
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-black dark:text-yellow-200 tracking-tight">
                  {recommendation.title}
                </p>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    {recommendation.year}
                  </span>
                  {recommendation.status && (
                    <span
                      className="rounded px-2 py-1 text-xs font-medium text-neutral-900 ring-1 ring-inset ring-gray-500/10"
                      style={{
                        backgroundColor:
                          recommendation.status.color || "#fde047",
                      }}
                    >
                      {recommendation.status.name}
                    </span>
                  )}
                </div>
              </div>

              {recommendation.description && (
                <span className="text-xs text-neutral-600 dark:text-neutral-200 tracking-tight">
                  {recommendation.description}
                </span>
              )}

              <div className="flex items-center text-xs text-neutral-600 space-x-4">
                {/* <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-xs">
                  {formatDate(recommendation.created)}
                </span> */}
                {recommendation.tags && recommendation.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {recommendation.tags.slice(0, 2).map((tag: any) => (
                      <span
                        key={tag.value}
                        className="rounded px-1 py-0.5 text-xs"
                        style={{
                          backgroundColor: tag.color || "#e5e7eb",
                          color: "#374151",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
