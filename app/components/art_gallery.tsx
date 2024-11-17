// Model component (renamed from Cube and made more generic)
'use client';
import React, {useRef, useState, useEffect} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls, useTexture } from '@react-three/drei';
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

const Player = () => {
  const playerRef = useRef<any>();
  const controlsRef = useRef<any>();
  const movement = useKeyboardControls();
  const {camera} = useThree()

  useEffect(() => {
    camera.position.set(0, 3, 0);
    if (controlsRef.current) {
      const controls = controlsRef.current;
      
      const lockPointer = () => {
        controls.lock();
      };

      document.addEventListener('click', lockPointer);
      return () => {
        document.removeEventListener('click', lockPointer);
      };
    }
  }, []);

  
  useFrame((state, delta) => {
    if (!playerRef.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    const player = playerRef.current;

    if (controls.isLocked){
      const direction = new THREE.Vector3();
      const frontVector = new THREE.Vector3();
      const sideVector = new THREE.Vector3();
      const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

      rotation.setFromQuaternion(camera.quaternion);

      // Calculate intended movement
      if (movement.KeyW) frontVector.setZ(-1);
      if (movement.KeyS) frontVector.setZ(1);
      if (movement.KeyA) sideVector.setX(1);
      if (movement.KeyD) sideVector.setX(-1);

      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED * delta);

      direction.applyEuler(new THREE.Euler(0, rotation.y, 0))

      player.setLinvel({
        x: direction.x * 10,
        y: 0,
        z: direction.z * 10
      })
      const position = player.translation();
      camera.position.x = position.x;
      camera.position.y = 3; // Fixed height
      camera.position.z = position.z;
  }

  });
  return( 
  <>
  <PointerLockControls ref={controlsRef} />
  <RigidBody
    ref={playerRef}
    position={[0, 3, 0]}
    enabledRotations={[false, false, false]}
    lockRotations={true}
    friction={0.2}
    mass={1}
    type="dynamic"
    linearDamping={0.95}
    angularDamping={0.95}
  >
  <mesh visible={false}>
    <capsuleGeometry args={[0.5, 1, 1, 4]} />
    <meshBasicMaterial wireframe />
  </mesh>
  </RigidBody>
  </>
);
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
      <Canvas className="h-96" shadows>
      <Physics debug>
      <EffectComposer>
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
      </EffectComposer>
      <Player/>
      <ambientLight intensity={0.5} />
          <spotLight
            position={[0, 10, 0]}
            angle={Math.PI / 4}
            intensity={1}
            castShadow
          />
      <Floor position={[0,0,0]} rotation={[-Math.PI / 2, 0, 0]}  />
      <Floor position={[0,5,0]} rotation={[Math.PI/2, 0, 0]} />
          <Wall 
            position={[0, 2.5, -10]} 
            rotation={[0, 0, 0]} 
          />
          <Wall 
            position={[-10, 2.5, 0]} 
            rotation={[0, Math.PI / 2, 0]} 
          />
          <Wall 
            position={[10, 2.5, 0]} 
            rotation={[0, -Math.PI / 2, 0]} 
          />
          <Wall 
            position={[0, 2.5, 10]} 
            rotation={[0, -Math.PI, 0]} 
          />
          <Painting 
            position={[-5, 2.5, -9.9]} 
            color="#ff0000" 
          />
      </Physics>
      </Canvas>
    </div>
    )
}