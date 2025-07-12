
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import type { Group, Mesh } from 'three';
import React from 'react';
import * as THREE from 'three';

// A single bird-like shape
function Bird() {
  const meshRef = useRef<Mesh>(null!);

  // Create a V-shape for the bird's wings
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(1, 0.5);
    s.lineTo(0, -0.5);
    s.lineTo(-1, 0.5);
    s.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(s, {
      steps: 2,
      depth: 0.1,
      bevelEnabled: false,
    });
  }, []);

  return (
    <mesh ref={meshRef} geometry={shape} scale={[0.4, 0.4, 0.4]}>
      <meshStandardMaterial color="hsl(var(--primary))" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// A flock of birds
function FloatingBirds() {
  const groupRef = useRef<Group>(null);
  const birds = useMemo(() => Array.from({ length: 15 }), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      // Animate each bird individually
      groupRef.current.children.forEach((child, i) => {
        const t = state.clock.getElapsedTime() + i * 10;
        child.position.y = Math.sin(t) * 0.5;
        (child as Group).children[0].rotation.x = Math.sin(t * 2) * 0.3 - 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {birds.map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random() * 2}
          rotationIntensity={0.5 + Math.random()}
          floatIntensity={1 + Math.random() * 2}
          // Distribute birds in a spherical pattern
          position={[
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 12,
          ]}
        >
          <Bird />
        </Float>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 60 }}
      className="opacity-80"
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={2.5}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.5}
        color="hsl(var(--primary))"
      />
      <FloatingBirds />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </Canvas>
  );
}
