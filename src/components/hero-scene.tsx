
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef } from 'react';
import type { Group } from 'three';
import React from 'react';

function FloatingItems() {
  const groupRef = useRef<Group>(null);

  // Rotate the whole group slowly
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Item 1 */}
      <Float
        speed={1.5}
        rotationIntensity={1.5}
        floatIntensity={2}
        position={[-3, 0.5, 0]}
      >
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1, 0.1, 16, 100]} />
          <meshStandardMaterial
            color="hsl(var(--primary))"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Item 2 */}
      <Float
        speed={2}
        rotationIntensity={1}
        floatIntensity={2.5}
        position={[3, -0.5, 0]}
      >
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.2, 0.1, 16, 100]} />
          <meshStandardMaterial
            color="hsl(var(--accent))"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Item 3 */}
      <Float
        speed={2.5}
        rotationIntensity={2}
        floatIntensity={1.5}
        position={[0, 0, -3]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
          <meshStandardMaterial
            color="hsl(var(--secondary))"
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 45 }}
      className="opacity-80"
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={3.5}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={1.5}
        color="hsl(var(--primary))"
      />
      <FloatingItems />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
