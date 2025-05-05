'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { forceSimulation, forceCenter, forceManyBody, forceCollide } from 'd3';
import { nodeServerAppPaths } from 'next/dist/build/webpack/plugins/pages-manifest-plugin';

const categories = [
{ id: "ithastry", name: "PRINCIPA AUTOMATICA", angle: 0, color: "#9370DB" },
{ id: "hushery", name: "RHETORICA", angle: 45, color: "#FFD700" },
{ id: "anchory", name: "CORPUS MECHANICA", angle: 90, color: "#4682B4" },
{ id: "skolespolophy", name: "CARTOGRAPHICA", angle: 135, color: "#32CD32" },
{ id: "the-bosk", name: "DIMENSIONAL MATERIALIZATION", angle: 180, color: "#FF4500" },
{ id: "preservation", name: "STORYCRAFT", angle: 225, color: "#FF1493" },
{ id: "birdsong", name: "APPARITION CONJURATION", angle: 270, color: "#00CED1" },
{ id: "horomachistry", name: "PRESERVATION VERDANT", angle: 315, color: "#FFA500" }
];

const sampleDescriptions = [
"An innovative approach to understanding temporal flows through interactive visualization. This project explores the intersection of time and space in a digital medium.",
"Sonic patterns translated into visual representations that reveal hidden structures. This experimental work bridges auditory and visual perception.",
"A deep analysis of the connections between organic systems and artificial constructs, presented through an interactive model.",
"Mapping knowledge structures through interconnected visual representations, allowing exploration of complex concept relationships.",
"A study in preservation techniques applied to digital ephemera, creating permanent records of transient information."
];

interface Node {
  vy: any;
  vx: any;
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  radius: number;
  color: string;
  description: string;
  dateCreated: string;
}
export default function ProjectClock({}){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [activeNode, setActiveNode] = useState<Node | null >(null);
    const simulationRef = useRef(null);
    const requestRef = useRef<number | null>(null);
    const svgRef = useRef(null);
    const centerX = 400;
    const centerY = 400;

    useEffect(() => {
        const newNodes:  Node[] = [];
        const radius = 200;
        categories.forEach((category, idx) => {
          const angleRad = (category.angle * Math.PI) / 180
          for (let i =0; i < 3; i++){
            const distance = radius * (0.4 + i *0.3) 
            const nodeAngle = angleRad 
            newNodes.push({
              id: `${category.id}-${i}`,
              name: `${category.name} Project ${i+1}`,
              category: category.id,
              vx: [],
              vy: [],
              x: centerX + Math.cos(nodeAngle) * distance,
              y: centerY + Math.sin(nodeAngle) * distance,
              tx: centerX + Math.cos(angleRad) * (radius * 0.7),
              ty: centerY + Math.sin(angleRad) * (radius * 0.7),
              radius: 10 + Math.random() * 10,
              color: category.color,
              description: sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)],
              dateCreated: `${2023 + Math.floor(Math.random() * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
            });
          }
        });
    
        setNodes(newNodes);
      }, [])
    useEffect(() => {
        if (nodes.length === 0) return;

        const simulation = forceSimulation(nodes)
            .force("center", forceCenter(400,400))
            .force("charge", forceManyBody().strength(-100))
            .force("collide", forceCollide().radius(d => d.radius * 1.2))

        simulation.force("categoryAttraction", alpha=> {
            nodes.forEach(node => {
                node.vx = (node.vx || 0) + (node.tx - node.x) * alpha * 0.1;
                node.vy = (node.vy || 0) + (node.ty - node.y) * alpha * 0.1;
            })
        })

        simulation.force("boundary", alpha => {
            const centerX = 400;
            const centerY = 400;
            const boundaryRadius = 250;
            
            nodes.forEach(node => {
              const dx = node.x - centerX;
              const dy = node.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance + node.radius > boundaryRadius) {
                const angle = Math.atan2(dy, dx);
                const correction = (distance + node.radius - boundaryRadius) / distance;                
                node.vx = (node.vx || 0) - Math.cos(angle) * correction * alpha * 50;
                node.vy = (node.vy || 0) - Math.sin(angle) * correction * alpha * 50;
              }
            });
          });

          simulation.stop();
          simulationRef.current = simulation;
          const animate = () => {
            // Run one tick of simulation
            simulation.tick();
            
            // Update state with new positions
            setNodes([...simulation.nodes()]);
            
            // Continue animation
            requestRef.current = requestAnimationFrame(animate);
          };
          return () => {
            simulation.stop();
            // cancelAnimationFrame(requestRef.current);
          };            
    }, [nodes.length])


    const handleNodeClick = (node) => {
        setActiveNode(activeNode?.id === node.id ? null : node);

        // if (simulationRef.current) {
        //     const clickedNode = simulationRef.current.nodes().find(n => n.id === node.id);
        //     if (clickedNode) {
        //         clickedNode.vx = 500;
        //         clickedNode.vy = 500;
        //     }
        //   }

        if (activeNode?.id !== node.id) {
            setTimeout(() => {
              document.getElementById('detail-card')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }, 100);
          }
    }

    
    return (
        <div className="flex flex-col w-full">
                                      <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            duration: 0.2,
                            layout: { duration: 0.3 }
                          }}
                          className=""
                        >
          <div className="relative w-full" id="visualization-container" style={{ minHeight: '500px' }}>
            <svg 
              ref={svgRef}
              className="w-full h-full" 
              viewBox="0 0 800 800"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>

                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <circle cx="400" cy="400" r="250" fill="none" stroke="#333" strokeWidth="2" />
              
              {[0.25, 0.5, 0.75].map((scale, i) => (
                <circle 
                  key={`circle-${i}`}
                  cx="400" 
                  cy="400" 
                  r={250 * scale} 
                  fill="none" 
                  stroke="#333" 
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              ))}
                            
              {categories.map(category => {
                const angleRad = (category.angle * Math.PI) / 180;
                const x2 = 400 + Math.cos(angleRad) * 260;
                const y2 = 400 + Math.sin(angleRad) * 260;
                const textX = 400 + Math.cos(angleRad) * 285;
                const textY = 400 + Math.sin(angleRad) * 285;
                
                return (
                  <g key={category.id}>
                    <line 
                      x1="400" 
                      y1="400" 
                      x2={x2} 
                      y2={y2} 
                      stroke={category.color} 
                      strokeWidth="2" 
                    />
                    <text 
                      x={textX} 
                      y={textY} 
                      fill={category.color}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="bold"
                      transform={`rotate(${category.angle + 90}, ${textX}, ${textY})`}
                    >
                      {category.name}
                    </text>
                  </g>
                );
              })}
              
              {/* Nodes */}
              {nodes.map(node => {
                // Create gem/octagon shape
                const points: number[] = [];
                const sides = 6;
                
                for (let i = 0; i < sides; i++) {
                  const angle = (Math.PI / 2) * i;
                  points.push(
                    node.x + Math.cos(angle) * node.radius,
                    node.y + Math.sin(angle) * node.radius
                  );
                }
                
                return (
                  <g 
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer"
                  >
                    <polygon 
                      points={points.join(' ')} 
                      fill={node.color}
                      stroke="white"
                      strokeWidth="1"
                      filter="url(#glow)"
                    //   opacity={activeNode?.id === node.id ? 1 : 0.8}
                      transform={activeNode?.id === node.id ? 'scale(1.2)' : 'scale(1)'}
                      className="transition-transform duration-300 ease-in-out"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Floating tooltip */}
            {activeNode && (
              <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-70 p-3 rounded-lg text-white backdrop-blur-sm shadow-lg border border-gray-700 text-sm max-w-xs">
                <h3 className="font-bold" style={{ color: activeNode.color }}>
                  {activeNode.name}
                </h3>
                <p className="text-gray-300 text-xs">
                  Click for details below
                </p>
              </div>
            )}
                      <div className="px-4 py-6">
            {activeNode ? (
              <div 
                id="detail-card"
                className="max-w-4xl mx-auto bg-zinc-800 rounded-lg overflow-hidden shadow-xl transition-all duration-500 ease-in-out transform translate-y-0 opacity-100"
                style={{ borderLeft: `4px solid ${activeNode.color}` }}
              >
                <div className="p-6">
                    <button onClick={() => document.getElementById('visualization-container')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm transition-colors">Back to Visualization</button>
                
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: activeNode.color }}>
                      {activeNode.name}
                    </h2>
                    <span className="text-gray-400 text-sm">
                      Created: {new Date(activeNode.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <div className="md:w-2/3">
                      <h3 className="font-bold text-zinc-300 mb-2">Project Description</h3>
                      <p className="text-gray-400 mb-4">
                        {activeNode.description}
                      </p>
                      
                      <h3 className="font-bold text-zinc-300 mb-2">Technical Details</h3>
                      <p className="text-gray-400 mb-4">
                        This project was developed using a combination of specialized techniques from the 
                        {' '}<span className="font-medium" style={{ color: activeNode.color }}>{categories.find(c => c.id === activeNode.category)?.name}</span>{' '}
                        discipline, integrating both traditional and experimental approaches.
                      </p>
                      
                      <div className="mt-6 flex gap-3">
                        <button className="px-4 py-2 bg-zinc-700 hover:bg-gray-600 rounded-md text-white text-sm transition-colors">
                          View Project
                        </button>
                        <button className="px-4 py-2 bg-zinc-900 hover:bg-gray-800 rounded-md text-white text-sm border border-gray-700 transition-colors">
                          Related Work
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 bg-zinc-900 rounded-lg p-4">
                      <h3 className="font-bold text-gray-300 mb-3">Metadata</h3>
                      <ul className="space-y-2 text-sm">

                        <li className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-green-400">Active</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-400">Last Updated:</span>
                          <span className="text-gray-300">2 weeks ago</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-400">Related Projects:</span>
                          <span className="text-gray-300">3</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-6 bg-zinc-800 bg-opacity-50 rounded-lg text-center text-gray-400">
                Click on any gem in the visualization to view project details
              </div>
            )}
          </div>
          </div>
          </motion.div>

        </div>
    );
};

