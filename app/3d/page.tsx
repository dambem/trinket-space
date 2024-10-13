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

export default function Three() {
    const hovered = true;
    return (
        <div id="canvas-container">
            <h3>Canary Wharf</h3>
            <ModelSnippet modelPath={'3d_models/canarywharf.glb'}></ModelSnippet>

        </div>
      )
}
