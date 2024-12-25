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

const CameraContext = React.createContext({ isOrbital: true, toggleCamera: () => {} });

function CameraController() {
  const [isOrbital, setIsOrbital] = useState(true);
  const { camera, gl } = useThree();
  const lastPositionRef = useRef(new Vector3());
  const lastRotationRef = useRef(new Euler());
  const orthoCameraRef = useRef(null);

  return (
        <OrthographicCamera
          ref={orthoCameraRef}
          makeDefault
          zoom={40}
          position={[0, 10, 10]}
          rotation={[-0.8, 0, 0]}
        />
  );
}

function Player() {
  const { isOrbital } = useContext(CameraContext);
  const [sub, get] = useKeyboardControls();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const prevPositionRef = useRef(new Vector3());
  const velocityRef = useRef(new Vector3());
  const movementSmoothing = useRef(new Vector3());
  
  const MOVE_SPEED = 0.15;
  const LERP_FACTOR = 0.15;
  const DAMPING = 4.0;
  const BOB_SPEED = 0.015;
  const BOB_AMOUNT = 0.05;
  const ACCELERATION = 0.08;
  const MAX_VELOCITY = 2;

  const { camera } = useThree();
  const bobTime = useRef(0);

  useFrame((state, delta) => {
    const { forward, backward, left, right } = get();
    const impulse = new Vector3();
    
    // Get camera direction vectors
    const cameraForward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const cameraRight = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    
    // Keep movement horizontal
    cameraForward.y = 0;
    cameraRight.y = 0;
    cameraForward.normalize();
    cameraRight.normalize();

    // Smooth acceleration
    if (forward) impulse.add(cameraForward);
    if (backward) impulse.sub(cameraForward);
    if (right) impulse.add(cameraRight);
    if (left) impulse.sub(cameraRight);

    const api = rigidBodyRef.current;
    if (!api) return;

    if (impulse.length() > 0) {
      impulse.normalize();
      movementSmoothing.current.lerp(impulse.multiplyScalar(MOVE_SPEED), ACCELERATION);
      
      if (movementSmoothing.current.length() > MAX_VELOCITY) {
        movementSmoothing.current.normalize().multiplyScalar(MAX_VELOCITY);
      }
      
      api.applyImpulse({
        x: movementSmoothing.current.x,
        y: 0,
        z: movementSmoothing.current.z
      }, true);
    } else {
      movementSmoothing.current.multiplyScalar(0.95);
    }

    api.setLinearDamping(DAMPING);

    const playerPosition = api.translation();
    const currentPosition = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z);

    if (isOrbital) {
      // In orbital mode, camera follows player position while maintaining height and rotation
      camera.position.x = playerPosition.x;
      camera.position.z = playerPosition.z;
    } else {
      // FPS camera movement with head bobbing
      const velocity = velocityRef.current.subVectors(currentPosition, prevPositionRef.current).length();
      
      if (velocity > 0.01) {
        bobTime.current += delta * BOB_SPEED * velocity;
        const bobOffset = Math.sin(bobTime.current * Math.PI * 2) * BOB_AMOUNT;
        
        camera.position.lerp(
          new Vector3(
            playerPosition.x,
            playerPosition.y + 1.8 + bobOffset,
            playerPosition.z
          ),
          LERP_FACTOR
        );
      } else {
        camera.position.lerp(
          new Vector3(
            playerPosition.x,
            playerPosition.y + 1.8,
            playerPosition.z
          ),
          LERP_FACTOR
        );
        bobTime.current = 0;
      }
    }

    prevPositionRef.current.copy(currentPosition);
  });

  return (
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
        <boxGeometry args={[0.4, 0.9, 0.4]} />
        <meshStandardMaterial transparent opacity={isOrbital ? 0.5 : 0.0} />
      </mesh>
    </RigidBody>
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
      <div className="h-dvh	">
        <Canvas className="h-dvh" shadows gl={{antialias: true}}>
            <EffectComposer>
            <Noise opacity={0.05} />
            <Bloom 
              intensity={0.2}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <ToneMapping 
              mode={THREE.ACESFilmicToneMapping}
            />
          </EffectComposer>
          <ambientLight intensity={0.5} />
          <directionalLight 
            castShadow 
            intensity={1.5} // Increased from 0.2
            shadow-mapSize={[2048, 2048]} // Increased resolution
            shadow-bias={-0.0001}
            position={[10, 10, 10]} // Moved to create more dramatic shadows
            shadow-camera-far={50}
            shadow-camera-near={1}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
           <spotLight
            castShadow
            intensity={2}
            angle={Math.PI / 4}
            position={[0, 10, 0]}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          <hemisphereLight intensity={0.3} color='#eaeaea' groundColor='blue' />
          <pointLight 
            intensity={0.8} 
            position={[-3, 2, -4]} 
            color="#ff7f00"
            distance={10}
            decay={2}
          />

          <pointLight 
            intensity={0.8} 
            position={[3, 2, 4]} 
            color="#7f7fff"
            distance={10}
            decay={2}
          />
          <Physics  interpolate={true}timeStep={1/60} >
            <CameraController/>  // Added new controller
            {/* Floor */}
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
              position={[7, 0, 0]} 
              rotation={[0, 0, 0]}
              scale={[1,1,1]}

              model='3d_models/wall.glb' 
            />
          </Physics>
        </Canvas>
      </div>
  );
}