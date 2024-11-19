'use client';
import React, {useRef, useState, useEffect} from "react";
import {Mesh, Vector3} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { PointerLockControls, useTexture, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Bloom, DepthOfField, EffectComposer, Glitch, Noise } from "@react-three/postprocessing";

function Player() {
  const [sub, get] = useKeyboardControls();
  const rigidBodyRef = useRef(null);
  const prevPositionRef = useRef(new Vector3());
  const velocityRef = useRef(new Vector3());
  const MOVE_SPEED = 0.1;
  const LERP_FACTOR = 0.1; // Smoothing factor for camera movement

  const { camera } = useThree();

  const PLAYER_SIZE = { width: 0.4, height: 0.9, depth: 0.4 };

  useFrame((state, delta) => {
    const { forward, backward, left, right } = get();
    const impulse = new Vector3(0, 0, 0);
    
    // Get camera's forward and right vectors
    const cameraForward = new Vector3(0, 0, -1);
    const cameraRight = new Vector3(1, 0, 0);
    
    // Rotate vectors based on camera rotation
    cameraForward.applyQuaternion(camera.quaternion);
    cameraRight.applyQuaternion(camera.quaternion);
    
    // Zero out y component to keep movement horizontal
    cameraForward.y = 0;
    cameraRight.y = 0;
    cameraForward.normalize();
    cameraRight.normalize();
  
    // Apply movement based on camera direction
    if (forward) impulse.add(cameraForward);
    if (backward) impulse.sub(cameraForward);
    if (right) impulse.add(cameraRight);
    if (left) impulse.sub(cameraRight);
    const api = rigidBodyRef.current as any;

    if (impulse.length() > 0 && rigidBodyRef.current) {
      impulse.normalize().multiplyScalar(MOVE_SPEED);
      api.applyImpulse({ x: impulse.x, y: 0, z: impulse.z }, true);
      api.setLinearDamping(3.0);
    }
  
    if (api) {
      const playerPosition = api.translation();
      const currentPosition = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
      
      // Calculate velocity
      velocityRef.current.subVectors(currentPosition, prevPositionRef.current).multiplyScalar(1 / delta);
      
      // Smooth camera movement using lerp
      camera.position.lerp(
        new Vector3(
          playerPosition.x,
          playerPosition.y + 1.8,
          playerPosition.z
        ),
        LERP_FACTOR
      );
      
      // Update previous position
      prevPositionRef.current.copy(currentPosition);

    }
  });

  return (
    <>
    <PointerLockControls pointerSpeed={0.5} />
    <RigidBody 
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]}
      mass={1}
      lockRotations
      friction={1}
      restitution={0}
    >
      <mesh castShadow>
        <boxGeometry args={[PLAYER_SIZE.width, PLAYER_SIZE.height, PLAYER_SIZE.depth]}  />
        <meshStandardMaterial 
              transparent={true} 
              opacity={0.0} 
            />
      </mesh>
    </RigidBody>
    </>
  );
}

function Model({position, rotation,  model, scale}) {
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
  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD'] },
      ]}
    >
      <div className="h-96">
        <Canvas className="h-96" shadows gl={{antialias: false}}>
          <color attach="background" args={['#202030']} />
            <EffectComposer>
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            <Bloom />
            <Noise opacity={0.05} />
            </EffectComposer>
          <ambientLight intensity={Math.PI} />
          <directionalLight 
            castShadow 
            intensity={0.2} 
            shadow-mapSize={[1024, 1024]} 
            shadow-bias={-0.0001} 
            position={[0, 3, 0]} 
          />
          <hemisphereLight intensity={0.4} color='#eaeaea' groundColor='blue' />
          
          <Physics  interpolate={true}
  timeStep={1/60} >
            <Player />
            
            {/* Floor */}
            <RigidBody type="fixed" friction={1} restitution={0}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#666666" />
              </mesh>
            </RigidBody>
            <Model 
              position={[-3, -1.5, -4]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
            />
            <Model 
              position={[3, -1.5, -4]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
            />
            <Model 
              position={[3, -1.5, 3]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
            />
            <Model 
              position={[-3, -1.5, 3]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[2,2,2]}
              model='3d_models/item.glb' 
            />
            {/* Walls */}
            <Model 
              position={[-5, 0, 0]} 
              rotation={[0, Math.PI, 0]}
              scale={[1,1,1]}

              model='3d_models/wall.glb' 
            />
            <Model 
              position={[1, 0, -6]} 
              rotation={[0, Math.PI/2, 0]}
              scale={[1,1,1]}

              model='3d_models/wall.glb' 
            />
            <Model 
              position={[1, 0, 6]} 
              rotation={[0, -Math.PI/2, 0]}
              scale={[1,1,1]}

              model='3d_models/wall.glb' 
            />
            <Model 
              position={[7, 0, 0]} 
              rotation={[0, 0, 0]}
              scale={[1,1,1]}

              model='3d_models/wall.glb' 
            />
            
          </Physics>
        </Canvas>
      </div>
    </KeyboardControls>
  );
}