'use client';
import React, {useRef, useState} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree  } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera } from '@react-three/drei';

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
                <CameraSetup />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Cube></Cube>
            </Canvas>
        </div>
      )
}


function CameraSetup() {
    const { viewport } = useThree();
    const aspect = viewport.width / viewport.height;
    const frustumSize = 10;

    return (
        <OrthographicCamera
            makeDefault
            zoom={1}
            left={-frustumSize * aspect / 2}
            right={frustumSize * aspect / 2}
            top={frustumSize / 1}
            bottom={-frustumSize / 2}
            near={0.1}
            far={1000}
            position={[0, 0, 500]}
        />
    );
}

function Cube() {
    const hovered = true
    const meshRef = useRef<Mesh>(null);
    const gltf = useLoader(GLTFLoader, '3d_models/canarywharf.glb')
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta/5.5
        }
    });
    return (
        <mesh ref={meshRef}>
            <primitive object={gltf.scene} />
        </mesh>
    )
}