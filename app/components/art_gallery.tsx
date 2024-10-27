// Model component (renamed from Cube and made more generic)
import React, {useRef, useState} from "react";
import {Mesh} from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from '@react-three/drei';

const SPEED = 5;
const keys = {
  KeyW: false,
  KeyS: false,
  KeyA: false,
  KeyD: false,
};