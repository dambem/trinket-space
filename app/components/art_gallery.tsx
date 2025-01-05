'use client';
import React, {useRef, useState, useEffect, useContext, useCallback} from "react";
import {Euler, Mesh, Vector3} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { PointerLockControls, useTexture, useGLTF } from '@react-three/drei';
import { Physics, RapierRigidBody, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Bloom, DepthOfField, EffectComposer, Glitch, Noise, ToneMapping } from "@react-three/postprocessing";
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import { GUI } from 'lil-gui'


const CameraContext = React.createContext({ isOrbital: true, toggleCamera: () => {} });

function Model({position, rotation,  model, scale, controlsRef}) {
  const { scene } = useGLTF(model) as any
  const {scene: cityScene}  = useGLTF('3d_models/winchester.glb')
  const texture = useTexture('photos/3dprints/nyc1.png')
  const clonedScene = scene.clone()
  const rigidBodyRef = useRef(null);

  // Calculate wall dimensions based on your model
  clonedScene.traverse((child) => {
    if (child.isMesh){
    if (child.name === 'Painting001') {
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.5,
        roughness: 0.5
      })

    }
    if (child.name === 'exhibit') {
      const clonedScene = cityScene.clone()

      // Preserve the original transform of the exhibit
      clonedScene.position.copy(child.position);
      clonedScene.position.y -= 0.12
      clonedScene.rotation.copy(child.rotation);
      clonedScene.scale.copy(child.scale);

      child.parent.add(clonedScene)
      child.parent.remove(child)
    }
  }
  })

  return (
    <RigidBody 
      ref={rigidBodyRef}
      type="fixed" 
      position={position} 
      rotation={rotation}
      scale={scale}
      friction={1}
      restitution={0}
    >
      <primitive object={clonedScene} />
    </RigidBody>
  );
} 

export function ArtGallery() {
  const orthoCameraRef = useRef(null);
  const controlsRef = useRef(null);
  return (
      <div className="h-dvh	">
        <Canvas className="h-dvh" shadows gl={{antialias: true}} eventlayer>
            <EffectComposer>
            <Noise opacity={0.05} />

            <ToneMapping 
              mode={THREE.ACESFilmicToneMapping}
            />
          </EffectComposer>
          <OrbitControls 
          ref={controlsRef} 
          enableZoom={true}
          minDistance={10}
          maxDistance={100}
          enablePan={false}
          autoRotate={false}
          target={[0, 0, 0]}
          />

          <OrthographicCamera
          ref={orthoCameraRef}
          makeDefault
          zoom={30}
          position={[50, 50, 50]}
          />
          <ambientLight intensity={4} />

           <spotLight
            castShadow
            intensity={20}
            angle={0}
            position={[0, 2, 0]}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          <hemisphereLight intensity={0.5} color='#eaeaea' groundColor='blue' />

          <Physics  interpolate={true}timeStep={1/60} >
            {/* Floor */}
            <Model 
              position={[-3, -1.5, -3]} 
              rotation={[0, Math.PI/4, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
              controlsRef={controlsRef}
            />
            <Model 
              position={[4, -1.5, -3]} 
              rotation={[0, Math.PI/4, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
              controlsRef={controlsRef}

            />
            <Model 
              position={[4, -1.5, 4]} 
              rotation={[0, Math.PI/4, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
              controlsRef={controlsRef}

            />
            <Model 
              position={[-2.5, -1.5, 4]} 
              rotation={[0, Math.PI/4, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
              controlsRef={controlsRef}

            />
            {/* Walls */}
            <Model 
              position={[-5, 0, 0]} 
              rotation={[0, Math.PI, 0]}
              scale={[1,1,1]}
              controlsRef={controlsRef}
              model='3d_models/wall.glb' 
            />
            <Model 
              position={[1, 0, -6]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[1,1,1]}
              controlsRef={controlsRef}
              model='3d_models/wall.glb' 
            />
          </Physics>
        </Canvas>
      </div>
  );
}