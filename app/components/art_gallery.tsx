'use client';
import React, {useRef, useState, useEffect, useContext, useCallback} from "react";
import {Euler, Mesh, Vector3} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls, GradientTexture, KeyboardControls, useKeyboardControls, SpotLight } from '@react-three/drei';
import { PointerLockControls, useTexture, useGLTF, useHelper } from '@react-three/drei';
import { Physics, RapierRigidBody, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Bloom, DepthOfField, EffectComposer, Glitch, Noise, ToneMapping, N8AO, TiltShift2 } from "@react-three/postprocessing";
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import { GUI } from 'lil-gui'
import { useControls } from 'leva'



const CameraContext = React.createContext({ isOrbital: true, toggleCamera: () => {} });

function Model({position, rotation,  model, scale, controlsRef}) {
  const { scene } = useGLTF(model) as any
  const {scene: cityScene}  = useGLTF('3d_models/winchester.glb')
  const texture = useTexture('theeye.png')
  const clonedScene = scene.clone()
  const rigidBodyRef = useRef(null);

  // Calculate wall dimensions based on your model
  clonedScene.traverse((child) => {

    if (child.isMesh){
    if (child.name === 'Painting001') {
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.1,
        roughness: 1.0
      })

    }
    else {
      child.castShadow = true
      child.receiveShadow = true
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
      <primitive object={clonedScene} castShadow receiveShadow/>
    </RigidBody>
  );
} 


export function ArtGallery() {
  const orthoCameraRef = useRef(null);
  const controlsRef = useRef(null);
  const spotRef = useRef();

  return (
      <div className="h-dvh	mt-2">
        <Canvas className="h-dvh" shadows 
        onCreated={(state) => {
          state.gl.toneMappingExposure  = 0.1,
          state.gl.toneMapping = THREE.ACESFilmicToneMapping 
        }}>
            <EffectComposer>

            <N8AO aoRadius={50} distanceFalloff={0.2} intensity={6} screenSpaceRadius halfRes />
            <ToneMapping>

            </ToneMapping>
            {/* <DepthOfField focusDistance={1} focalLength={0.02} bokehScale={2} height={480} /> */}
            {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
            <Noise opacity={0.02} />
          </EffectComposer>

          <OrbitControls 
          ref={controlsRef} 
          enableZoom={true}
          minDistance={10}
          maxDistance={100}
          maxPolarAngle={Math.PI/2-0.2}
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


          <hemisphereLight args={[0xffffff, 0x8d8d8d, 3]}
          />

          <directionalLight args={[0xffffff, 5]} 
            position={[3,3,0]}
            castShadow
          />

          
          {/* <SpotLight args={[0xffffff, 500]}
            position={[3,3,3]}  
            attenuation={20}
            angle={Math.PI/6}
            decay={2}
            penumbra={1}
            distance = {20}
            intensity={30}
            castShadow  
          /> */}
          <Physics  interpolate={true}timeStep={1/60} >
            {/* Floor */}
            <Model 
              position={[0, -1.5, 0]} 
              rotation={[0, Math.PI*3/4, 0]}
              scale={[4,4,4]}
              model='3d_models/item.glb' 
              controlsRef={controlsRef}
            />

            <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[5, 2, 5]} castShadow receiveShadow>
              <planeGeometry args={[200, 10]} />
              <meshStandardMaterial>

              <GradientTexture 
                stops={[0, 0.5]} // Position of color stops
                colors={['#f9dde7', '#dde7f9']} // Pastel pink to pastel blue
                size={1024} // Resolution of the gradient texture
              />          
              </meshStandardMaterial>  
            </mesh>
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