
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';
import React from 'react';

// A single floating/falling ingredient
function Ingredient({
  initialPosition,
}: {
  initialPosition: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null!);
  const [velocity] = useState(
    () => new THREE.Vector3(0, -0.01 - Math.random() * 0.02, 0)
  );
  const [rotationSpeed] = useState(
    () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      )
  );

  const { geometry, material } = useMemo(() => {
    const shapes = [
      {
        geom: new THREE.BoxGeometry(0.3, 0.3, 0.3),
        mat: new THREE.MeshStandardMaterial({
          color: 'hsl(var(--accent))',
          roughness: 0.4,
        }),
      }, // Diced carrot
      {
        geom: new THREE.SphereGeometry(0.2, 16, 16),
        mat: new THREE.MeshStandardMaterial({
          color: '#ff4d4d',
          roughness: 0.3,
        }),
      }, // Tomato
      {
        geom: new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
        mat: new THREE.MeshStandardMaterial({
          color: 'hsl(var(--primary))',
          roughness: 0.6,
        }),
      }, // Chopped celery
      {
        geom: new THREE.TorusGeometry(0.2, 0.05, 8, 24),
        mat: new THREE.MeshStandardMaterial({
          color: '#ffde59',
          roughness: 0.5,
        }),
      }, // Onion ring
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.add(velocity);
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;

      // Bounce off the pan (approximate pan surface y = -1.5)
      if (meshRef.current.position.y < -1.5) {
        meshRef.current.position.y = -1.5;
        velocity.y = Math.abs(velocity.y) * 0.6; // Lose some energy on bounce
      }

      // Reset when it falls out of view
      if (meshRef.current.position.y < -5) {
        meshRef.current.position.set(...initialPosition);
        velocity.y = -0.01 - Math.random() * 0.02;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      geometry={geometry}
      material={material}
    />
  );
}

// The frying pan model
function FryingPan() {
  return (
    <group rotation={[Math.PI * 0.1, Math.PI * 0.25, 0]} position={[0, -2, 0]}>
      {/* Pan Base */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.4, 64]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Pan Interior */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.35, 64]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Handle */}
      <mesh position={[2.8, 0.2, 0]} rotation={[0, 0, -Math.PI * 0.05]}>
        <boxGeometry args={[2.5, 0.2, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// The main scene component
export function HeroScene() {
  const [ingredients, setIngredients] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newIngredients = Array.from({ length: 50 }, (_, i) => {
      const initialPosition: [number, number, number] = [
        (Math.random() - 0.5) * 5,
        3 + Math.random() * 5,
        (Math.random() - 0.5) * 5,
      ];
      return <Ingredient key={`ingredient-${i}`} initialPosition={initialPosition} />;
    });
    setIngredients(newIngredients);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 50 }}
      className="opacity-90"
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={2.5}
        castShadow
      />
      <pointLight
        position={[-5, 5, -5]}
        intensity={50}
        color="hsl(var(--accent))"
      />
      <pointLight
        position={[0, -5, 0]}
        intensity={20}
        color="hsl(var(--primary))"
      />

      <FryingPan />

      <group>{ingredients}</group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        target={[0, -1, 0]}
      />
    </Canvas>
  );
}
