'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import type { Group } from 'three';

function ColorfulSpheres() {
  const groupRef = useRef<Group>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.z += delta * 0.1;
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t) * 0.2;
    }
  });

  const spheres = [
    { color: '#ff6b6b', position: [0, 0, 0], scale: 1.2, roughness: 0.1, metalness: 0.6 },
    { color: '#4ecdc4', position: [2, 1, -1], scale: 0.8, roughness: 0.5, metalness: 0.2 },
    { color: '#45b7d1', position: [-2, -1, 1], scale: 0.9, roughness: 0.2, metalness: 0.8 },
    { color: '#f7d794', position: [1, -2, -2], scale: 0.7, roughness: 0.8, metalness: 0.1 },
    { color: '#a29bfe', position: [-1, 2, 2], scale: 0.6, roughness: 0.3, metalness: 0.9 },
  ];

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, index) => (
        <Sphere
          key={index}
          position={sphere.position as [number, number, number]}
          args={[sphere.scale, 32, 32]}
        >
          <meshStandardMaterial
            color={sphere.color}
            roughness={sphere.roughness}
            metalness={sphere.metalness}
          />
        </Sphere>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      className="opacity-60"
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 10, 7.5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#4ecdc4" />
      <ColorfulSpheres />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
