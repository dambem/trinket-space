// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
const STATUS_ORDER = ['active', 'back-burner', 'paused', 'completed', 'on hold', 'other'];

  
export default function ProjectFilters({ projects, availableStatuses, availableTags }) {
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
  
    // Organize projects by status
    const projectsByStatus = useMemo(() => {
      // Create an object to hold projects for each status
      const statusGroups = STATUS_ORDER.reduce((acc, status) => {
        acc[status] = [];
        return acc;
      }, { other: [] });
  
      // Filter projects based on selected tags
      const filteredProjects = projects.filter(project => {
        const tagMatch = selectedTags.length === 0 || 
          (project.tags && project.tags.some(tag => selectedTags.includes(tag.value)));
        return tagMatch;
      });
  
      // Categorize filtered projects
      filteredProjects.forEach(project => {
        const projectStatus = project.status?.value?.toLowerCase() || 'other';
        const matchingStatus = STATUS_ORDER.find(status => 
          projectStatus.includes(status)
        ) || 'other';
        
        statusGroups[matchingStatus].push(project);
      });
  
      return statusGroups;
    }, [projects, selectedTags]);
  
    // Handle tag filter toggle
    const toggleTag = (tagId) => {
      setSelectedTags(prev => 
        prev.includes(tagId) 
          ? prev.filter(id => id !== tagId)
          : [...prev, tagId]
      );
    };
  
    // Clear all filters
    const clearFilters = () => {
      setSelectedTags([]);
    };
  
    return (
      <>
        {/* Tag Filters */}
        <div className="mb-5 space-y-2">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag.value}
                  onClick={() => toggleTag(tag.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                    selectedTags.includes(tag.value)
                      ? 'bg-yellow-200 text-black border-yellow-200'
                      : 'bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {tag.value}
                </button>
              ))}
            </div>
          </div>
  
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
  
        {/* Projects Grouped by Status */}
        {STATUS_ORDER.map(status => {
          const statusProjects = projectsByStatus[status];
          
          // Only render section if there are projects
          if (statusProjects.length === 0) return null;
  
          return (
            <div key={status} className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-300 mb-6 capitalize">
                {status} Projects ({statusProjects.length})
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                  {statusProjects.map((project, index) => (
                    <motion.div
                      key={project.slug?.current || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Link
                        href={`/projects/${project?.slug?.current}`}
                        // href={project.url}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        className="group rounded drop-shadow-md block bg-transparent overflow-hidden shadow-sm hover:shadow-md hover:bg-stone-950 transition-shadow duration-300"
                      >
                        <div className="relative aspect-video">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 grayscale group-hover:grayscale-0 transform group-hover:scale-105"
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h2 className="font-medium text-yellow-200 tracking-tight truncate flex-1 mr-2">
                              {project.title}
                            </h2>
                            
                            {/* Status indicator */}
                            {project.status && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 whitespace-nowrap"
                                style={{ 
                                  backgroundColor: project.status.color ? `${project.status.color}20` : undefined,
                                  color: project.status.color || undefined 
                                }}
                              >
                                {project.status.value}
                              </span>
                            )}
                          </div>
                          
                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.tags.map(tag => (
                                <span
                                  key={tag.value}
                                  className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300"
                                  style={{ 
                                    backgroundColor: tag.color ? `${tag.color}20` : undefined,
                                    color: tag.color || undefined 
                                  }}
                                >
                                  {tag.value}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
  
        {/* No results message */}
        {Object.values(projectsByStatus).every(group => group.length === 0) && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No projects found matching your filters.</p>
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