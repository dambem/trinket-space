'use client';
import React, {useRef, useState} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree  } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { ModelSnippet } from "app/components/model";
// import CanaryWharf from 'public/3d_models/canarywharf.glb'
// export const metadata: Metadata = {
//   title: "3D Design",
//   description: "My 3D Portfolio",
// };

const ModelGrid = ({ models }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-0">
        {models.map((model, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="mb-4 text-xl font-medium tracking-tight">{model.title}</h3>
            <ModelSnippet modelPath={model.path} />
          </div>
        ))}
      </div>
    );
  };

export default function Three() {
    const hovered = true;
    const modelData = [
        { title: 'Canary Wharf', path: '3d_models/canarywharf.glb' },
        { title: 'Winchester', path: '3d_models/winchester.glb' },
        { title: 'NYC', path: '3d_models/NYC.glb' },
      ];
    
    return (
        <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">3D Model Gallery</h2>
        <ModelGrid models={modelData} />
      </div>
  
      )
}
