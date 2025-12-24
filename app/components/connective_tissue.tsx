"use client";

// ProjectFlow.tsx
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomProjectNode } from "app/components/flow/CustomProjectNode";

type Project = {
  id: string;
  label: string;
  skills: string[];
  position: { x: number; y: number };
  connectsTo?: string[];
};

const nodeTypes = {
  custom: CustomProjectNode,
};
const sampleProjects = [
  {
    id: "1",
    label: "Portfolio Website",
    skills: ["Frontend", "React"],
    position: { x: 50, y: 100 },
    description: "Personal portfolio showcasing projects and blogs.",
    url: "https://myportfolio.com",
    connectsTo: ["2"],
  },
  {
    id: "2",
    label: "Blog CMS",
    skills: ["Backend", "Node.js"],
    position: { x: 300, y: 150 },
    description: "Custom CMS with markdown and authentication.",
    url: "https://github.com/me/blog-cms",
  },
];

export default async function ProjectFlow() {
  const nodes: Node[] = sampleProjects.map((project) => ({
    id: project.id,
    data: {
      label: project.label,
      description: project.description,
      url: project.url,
    },
    position: project.position,
    type: "custom",
  }));

  const edges: Edge[] = sampleProjects.flatMap((project) =>
    (project.connectsTo || []).map((targetId) => ({
      id: `${project.id}-${targetId}`,
      source: project.id,
      target: targetId,
      animated: true,
    }))
  );
  return (
    <div style={{ height: 600 }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
