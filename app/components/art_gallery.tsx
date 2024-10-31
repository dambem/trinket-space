// Model component (renamed from Cube and made more generic)
import React, {useRef, useState, useEffect} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const MOVEMENT_SPEED = 5;

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
  const controlsRef = useRef<any>();
  const movement = useKeyboardControls();

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // Update movement based on keyboard state
    if (movement.KeyW) frontVector.setZ(-1);
    if (movement.KeyS) frontVector.setZ(1);
    if (movement.KeyA) sideVector.setX(-1);
    if (movement.KeyD) sideVector.setX(1);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVEMENT_SPEED * delta);

    controls.moveRight(-direction.x);
    controls.moveForward(-direction.z);

    // Simple collision detection
    const position = controls.getObject().position;
    // position.x = Math.max(-9, Math.min(9, position.x));
    // position.z = Math.max(-9, Math.min(9, position.z));
    position.y = 3; // Lock the height to prevent any vertical movement

  });

  return <PointerLockControls ref={controlsRef} />;
};

  
const Painting = ({ position, rotation = [0.0, 0.0, 0.0], size = [3, 2], color }) => {
    return (
      <group position={position} rotation={[0, 0, 0]}>
        {/* Frame */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
          <meshPhongMaterial color="#444444" />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[3,2]} />
          <meshPhongMaterial color={color} />
        </mesh>
      </group>
    );
  };

const Floor = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshPhongMaterial color="#cccccc" />
    </mesh>
  );
  
  const Wall = ({ position, rotation }) => (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[20, 10]} />
      <meshPhongMaterial color="#ffffff" />
    </mesh>
  );
  

export function ArtGallery(){
    return(
    <div style={{height:400}}>
    
    <Canvas shadows>
    <Player/>
    <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={Math.PI / 4}
          intensity={1}
          castShadow
        />
    <Floor />
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
                <Painting 
          position={[-5, 2.5, -9.9]} 
          color="#ff0000" 
        />
    </Canvas>
    </div>
    )
}