// Model component (renamed from Cube and made more generic)
import React, {useRef, useState} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree  } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


function Model({ modelPath }) {
    const meshRef = useRef<Mesh>(null);
    const gltf = useLoader(GLTFLoader, modelPath) as GLTF;
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta/5.5;
        }
    });
    return (
        <mesh ref={meshRef} scale={10}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}

function CameraSetup() {
    const { viewport } = useThree();
    const aspect = viewport.width / viewport.height;
    const frustumSize = 10;

    return (
        <OrthographicCamera
            makeDefault
            zoom={0.4}
            left={-frustumSize * aspect / 2}
            right={frustumSize * aspect / 2}
            top={frustumSize / 1}
            bottom={-frustumSize / 2}
            near={0.1}
            far={1000}
            position={[0, 250, 300]}
            rotation={[0, Math.PI, 0]}

        />
    );
}

export function ModelSnippet({modelPath}){
    return(
        <section>
            <Canvas style={{height:300}}>
                <CameraSetup />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[30, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI*5} />
                <pointLight position={[0, 0, 10]} decay={0} intensity={Math.PI*10} />
                <Model modelPath={modelPath}></Model>
                <OrbitControls enablePan={false} enableZoom={true} />
            </Canvas>
        </section>
    )
}