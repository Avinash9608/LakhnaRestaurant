
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import type { Mesh } from 'three';
import * as THREE from 'three';
import React from 'react';

function FoodParticle({
  shape,
  color,
  ...props
}: {
  shape: 'sphere' | 'box' | 'cone' | 'torus';
  color: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null!);
  const geometry = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return new THREE.SphereGeometry(1, 16, 16);
      case 'box':
        return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      case 'cone':
        return new THREE.ConeGeometry(1, 2, 16);
      case 'torus':
        return new THREE.TorusGeometry(1, 0.4, 16, 32);
      default:
        return new THREE.SphereGeometry(1, 16, 16);
    }
  }, [shape]);

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh ref={meshRef} {...props} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

const ingredients = [
  {
    shape: 'sphere' as const,
    color: 'hsl(var(--primary))',
    position: [-3, 2, -1],
    scale: 0.5,
    rotation: [0.1, 0.2, 0.3],
  },
  {
    shape: 'box' as const,
    color: 'hsl(var(--accent))',
    position: [2, -1, 1],
    scale: 0.4,
    rotation: [0.4, 0.5, 0.6],
  },
  {
    shape: 'cone' as const,
    color: '#ffffff',
    position: [-1, -2, -2],
    scale: 0.3,
    rotation: [0.7, 0.8, 0.9],
  },
  {
    shape: 'torus' as const,
    color: 'hsl(var(--secondary))',
    position: [3, 1, -3],
    scale: 0.6,
    rotation: [1.0, 1.1, 1.2],
  },
    {
    shape: 'sphere' as const,
    color: '#dddddd',
    position: [4, 3, 0],
    scale: 0.2,
    rotation: [0.2, 0.5, 0.1],
  },
    {
    shape: 'box' as const,
    color: 'hsl(var(--primary))',
    position: [-4, -3, 0],
    scale: 0.7,
    rotation: [0.6, 0.3, 0.8],
  },
];

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      className="opacity-80"
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={200} />
      <pointLight position={[-10, -10, -10]} intensity={150} color="hsl(var(--primary))"/>
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      <group>
        {ingredients.map((ingredient, i) => (
          <FoodParticle key={i} {...ingredient} />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
