// @ts-nocheck
"use client";
import ProjectCard from "./projectcard";
import { ProjectCardTest } from "./projectcard";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_ORDER = [
  "active",
  "back-burner",
  "paused",
  "completed",
  "on hold",
  "other",
];

export default function ProjectFilters({
  projects,
  availableStatuses,
  availableTags,
  availableMainTags,
}) {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMainTags, setSelectedMainTags] = useState([]);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");

  // Organize projects by status (for grid view)
  const projectsByStatus = useMemo(() => {
    const statusGroups = STATUS_ORDER.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      { other: [] }
    );

    const filteredProjects = projects.filter((project) => {
      const tagMatch =
        selectedTags.length === 0 ||
        (project.tags &&
          project.tags.some((tag) => selectedTags.includes(tag.value)));
      return tagMatch;
    });

    filteredProjects.forEach((project) => {
      const projectStatus = project.status?.value?.toLowerCase() || "other";
      const matchingStatus =
        STATUS_ORDER.find((status) => projectStatus.includes(status)) ||
        "other";

      statusGroups[matchingStatus].push(project);
    });

    return statusGroups;
  }, [projects, selectedTags]);

  // Organize projects by date (for timeline view)
  const projectsByDate = useMemo(() => {
    const filteredProjects = projects.filter((project) => {
      const tagMatch =
        selectedTags.length === 0 ||
        (project.tags &&
          project.tags.some((tag) => selectedTags.includes(tag.value)));
      return tagMatch;
    });

    // Sort by start date (newest first)
    const sorted = [...filteredProjects].sort((a, b) => {
      const dateA = a.start ? new Date(a.start).getTime() : 0;
      const dateB = b.start ? new Date(b.start).getTime() : 0;
      return dateB - dateA;
    });
    const grouped: Record<string, any[]> = {};
    sorted.forEach((project) => { 
    let key = "No date";
    if (project.start) {
      const date = new Date(project.start);
      key = date.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(project);
  });
  return grouped

  }, [projects, selectedTags]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleMainTag = (tagId) => {
    setSelectedMainTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  const noResults = viewMode === "grid"
    ? Object.values(projectsByStatus).every((group) => group.length === 0)
    : projectsByDate.length === 0;

  return (
    <>
      <div className="mb-5 space-y-2">
        {/* View toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-200 flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-yellow-200 text-black border-yellow-200"
                : "bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400 hover:text-zinc-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-200 flex items-center gap-1.5 ${
              viewMode === "timeline"
                ? "bg-yellow-200 text-black border-yellow-200"
                : "bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400 hover:text-zinc-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22"/>
              <circle cx="12" cy="6" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="18" r="2"/>
            </svg>
            Timeline
          </button>
        </div>

        {/* Tag filters */}
        <div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  selectedTags.includes(tag.value)
                    ? "bg-yellow-200 text-black border-yellow-200"
                    : "bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400 hover:text-zinc-300"
                }`}
              >
                {tag.value}
              </button>
            ))}
          </div>
        </div>

        {selectedTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="mb-6">
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bento-grid gap-8"
            >
              {STATUS_ORDER.map((status) => {
                const statusProjects = projectsByStatus[status];
                if (statusProjects.length === 0) return null;

                return statusProjects.map((project, index) => (
                  <ProjectCard key={project._id || index} project={project} />
                ));
              })}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-[60px] md:left-[80px] top-0 bottom-0 w-px bg-zinc-700" />
                    {Object.entries(projectsByDate).map(([monthYear, monthProjects], groupIndex) => (

              <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    // transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4 md:gap-6"
                  >
                    <>

                    <div className="w-[50px] md:w-[70px] flex-shrink-0 text-right">

                      <span className="text-xs text-zinc-500 font-mono">
                        {monthYear}
                      </span>
                    </div>

                    <div className="relative flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-yellow-200 border-2 border-zinc-900 z-10 relative" />
                    </div>

                    <div className="bento-grid gap-6 w-full">
                    {monthProjects.map((project, index) => (

                      <ProjectCard project={project} />
                    ))} 

                    </div>
                    </>

                  </motion.div>
              </div>
                    ))}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {noResults && (
        <div className="text-center py-12">
          <p className="text-zinc-400">
            No projects found matching your filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 text-yellow-200 hover:text-yellow-100 text-sm transition-colors"
          >
            Clear filters to see all projects
          </button>
        </div>
      )}
    </>
  );
}