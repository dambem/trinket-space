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

  // Organize projects by status
  const projectsByStatus = useMemo(() => {
    const statusGroups = STATUS_ORDER.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      { other: [] }
    );

    // Filter projects based on selected tags
    const filteredProjects = projects.filter((project) => {
      const tagMatch =
        selectedTags.length === 0 ||
        (project.tags &&
          project.tags.some((tag) => selectedTags.includes(tag.value)));
      return tagMatch;
    });

    // Categorize filtered projects
    filteredProjects.forEach((project) => {
      const projectStatus = project.status?.value?.toLowerCase() || "other";
      const matchingStatus =
        STATUS_ORDER.find((status) => projectStatus.includes(status)) ||
        "other";

      statusGroups[matchingStatus].push(project);
    });

    return statusGroups;
  }, [projects, selectedTags]);

  // Handle tag filter toggle
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
  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <>
      <div className="mb-5 space-y-2">
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
        {/* <div className="mb-5 space-y-2">
          <div>
            <div className="flex flex-wrap gap-2">
              {availableMainTags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => toggleMainTag(tag.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                    selectedMainTags.includes(tag.value)
                      ? "bg-yellow-200 text-black border-yellow-200"
                      : "bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {tag.value}
                </button>
              ))}
            </div>
          </div>
        </div> */}
        {/* Clear Filters */}
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
        <div className="bento-grid gap-8">
          {STATUS_ORDER.map((status) => {
            const statusProjects = projectsByStatus[status];

            // Only render section if there are projects
            if (statusProjects.length === 0) return null;

            return (
              <AnimatePresence>
                {statusProjects.map((project, index) => (
                  <ProjectCard project={project} />
                  // <ProjectCardTest />
                ))}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
      {/* No results message */}
      {Object.values(projectsByStatus).every((group) => group.length === 0) && (
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
