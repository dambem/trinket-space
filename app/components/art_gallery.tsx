// Model component (renamed from Cube and made more generic)
'use client';
import React, {useRef, useState, useEffect} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls, useTexture, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, CapsuleCollider } from '@react-three/rapier';

import * as THREE from 'three';

import { Bloom, DepthOfField, EffectComposer, Noise, Vignette, Glitch } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import Three from "app/3d/page";

const MOVEMENT_SPEED = 5;
const COLLISION_BUFFER = 0.5; // Add a small buffer to prevent getting too close to walls

const SPEED = 5;
const keys = {
  KeyW: false,
  KeyS: false,
  KeyA: false,
  KeyD: false,
};



function Model({position, rotation, model}) {
  const { scene } = useGLTF(model) as any
  const texture = useTexture('photos/3dprints/nyc1.png')
  
  // Clone and modify the scene directly
  const clonedScene = scene.clone()
  
  clonedScene.traverse((child) => {
    console.log("Scene")
    console.log(child.name)
    if (child.isMesh && child.name === 'Painting001') {
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.5,
        roughness: 0.5
      })
    }
  })

  return <primitive  position={position} rotation={rotation} object={clonedScene} />
}

// Custom hook for keyboard controls
const useKeyboardControls = () => {
  const [movement, setMovement] = useState({
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        setMovement(m => ({ ...m, [e.code]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        setMovement(m => ({ ...m, [e.code]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};

const Painting = ({ position, rotation = [0.0, 0.0, 0.0], size = [3, 2], color }) => {
    const texture = useTexture('/photos/3dprints/nyc1.png')
    return (
      <group position={position} rotation={[0, 0, 0]}>
        {/* Frame */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
          <meshPhongMaterial color="#444444" />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 0, 0.2]}>
          <planeGeometry args={[3,2]} />
          <meshPhongMaterial map={texture} />
        </mesh>
      </group>
    );
  };

const Floor = ({position, rotation}) => (
    // <RigidBody type="fixed" position={position} rotation={rotation}>
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[20, 20]} />
      <meshPhongMaterial color="#cccccc" />
    </mesh>
    // </RigidBody>
  );
  
  const Wall = ({ position, rotation }) => (
    // <RigidBody colliders="trimesh" type="fixed" friction={0} restitution={0}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[20, 10]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
    // </RigidBody>
  );
  

export function ArtGallery(){
    return(
    <div className="h-96">
      <Canvas className="h-96" shadows gl={{antialias: false }}>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight castShadow intensity={0.2} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} position={[0, 0, 0]} />

      <hemisphereLight intensity={0.4} color='#eaeaea' groundColor='blue' />
      <Physics debug>
      {/* <EffectComposer>
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.05} />
          <Glitch 
          delay={new THREE.Vector2(5.5, 10.5)} // min and max glitch delay
          duration={new THREE.Vector2(0.1, 0.2)} // min and max glitch duration
          strength={new THREE.Vector2(0.8, 1.0)} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={1} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
          />
      </EffectComposer> */}
      <ambientLight intensity={0.5} />
          <spotLight
            position={[0, 10, 0]}
            angle={Math.PI / 4}
            intensity={1}
            castShadow
          />
      <Model  position={[0, -2.5, 0]} 
            rotation={[0, 0, 0]}
            model='3d_models/floor.glb' />
      <Model  position={[0, 0, 0]} 
            rotation={[0, Math.PI, 0]}
            model='3d_models/wall.glb' />
      <Model  position={[6, 0, -6]} 
            rotation={[0, Math.PI/2, 0]}
            model='3d_models/wall.glb' />
      <Model  position={[6, 0, 6]} 
            rotation={[0, -Math.PI/2, 0]}
            model='3d_models/wall.glb' />
      <Model  position={[12, 0, 0]} 
            rotation={[0, 0, 0]}
            model='3d_models/wall.glb' />
      <OrthographicCamera makeDefault far={100} near={0.1} position={[0, 20, 10]} zoom={10} />
      <OrbitControls autoRotate enableZoom={true} />

      </Physics>
      </Canvas>
    </div>
    )
}