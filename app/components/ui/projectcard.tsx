import Link from "next/link";
import localFont from "next/font/local";

import { motion, AnimatePresence } from "framer-motion";
const AdvercaseFont = localFont({
  src: "../../font/AdvercaseFont.otf",
  variable: "--font-advercase",
  display: "swap",
});
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
          {/* <div className="artifact-badge">  𝜶</div> */}
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
          <div className='pb-2'>
          <h2 className={`${AdvercaseFont.className} card-title font-medium text-yellow-200 tracking-tight  flex-1 mr-2 mb-5`}>
            {project.blurb} <b>({new Date(project.start).getFullYear()})</b>
          </h2>
          {project.tagMain && (
          <div className="tags">
          
          <span className="tag-primary" style={{color: project.tagMain.color.hex}}>{project.tagMain.value}</span>
          </div>
          )}
          </div>
          <div className="card-meta">
          
          <h3>{project.title}</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
            {project.description}
          </p>
                <div className="action-buttons justify-end">
                    <a href={`/projects/${project?.slug?.current}`} className="action-btn" title="About">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                    </a>
                    {project.url && (
                    <a href={project?.url} className="action-btn" title="View Project">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                    </a>
                    )}
                </div>


          </div>
        </div>
      </motion.div>
    </>
  );
}
