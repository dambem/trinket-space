'use client';
import React, {useRef, useState} from "react";
import {Mesh} from 'three';
import type { Metadata } from "next";
import { Canvas, useFrame, useLoader  } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import CanaryWharf from 'public/3d_models/canarywharf.glb'
// export const metadata: Metadata = {
//   title: "3D Design",
//   description: "My 3D Portfolio",
// };

export default function Three() {
    const hovered = true;
    return (
        <div id="canvas-container">
            <Canvas>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Cube></Cube>
            </Canvas>
        </div>
      )
}

function Cube() {
    const hovered = true
    const meshRef = useRef<Mesh>(null);
    // const gltf = useLoader(GLTFLoader, '3d_models/canarywharf.glb')
    // useFrame((state, delta) => (meshRef.current.rotation.y += delta))
    return (
        <mesh
            ref={meshRef}>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            <Cube/>
            {/* <primitive object={gltf.scene} /> */}
        </mesh>
    )
}