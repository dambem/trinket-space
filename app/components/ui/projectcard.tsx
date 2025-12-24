import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
export function ProjectCardTest() {
  return (
    <div className="card">
      <span className="card-status active">active</span>

      <div className="card-visual">
        <img src="avatar.jpeg" alt="Solaris"></img>
      </div>

      <div className="card-info">
        <div className="card-tag">AI</div>
        <h3 className="card-title">Solaris (2025)</h3>
        <p className="card-desc">
          A living planet - using Gemini API with large RAG prompt to create
          fake planet-like intelligence
        </p>

        <div className="card-actions">
          <a
            href="https://external-link.com"
            className="card-btn card-btn-secondary"
            target="_blank"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            Link
          </a>
          <a href="/projects/solaris" className="card-btn card-btn-primary">
            Read more
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
export default function ProjectCard({ project }) {
  return (
    <>
      <motion.div
        className={"card" + (project.cardSize ? " card-" + project.cardSize : "")}
        key={project.slug?.current}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.1 }}
      >
        <div className="card-bg">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300  transform group-hover:scale-105"
          />
        </div>
        <div className="card-artifacts">
          <div className="artifact-badge">  𝜶</div>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag.value}
                    className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : undefined,
                      color: tag.color || undefined,
                    }}
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            )}
        </div>

        <div className="card-content absolute bottom-0 left-0 right-0 z-20 p-5">
          <h2 className="card-title font-medium text-yellow-200 tracking-tight truncate flex-1 mr-2">
            {project.blurb}
          </h2>
          <div className="card-meta">
          
          <h3>{project.title}</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
            {project.description}
          </p>
          <div className="flex items-center gap-3">
                        <Link
              href={`/projects/${project?.slug?.current}`}
              className="group rounded drop-shadow-md block bg-transparent overflow-hidden shadow-sm hover:shadow-md hover:bg-stone-950 transition-shadow duration-300"
            >
              View Project
            </Link>

          </div>


          </div>
        </div>
      </motion.div>
    </>
  );
}
