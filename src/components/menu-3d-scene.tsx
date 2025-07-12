'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function FoodModel({ modelColor }: { modelColor: string }) {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]}>
      <coneGeometry args={[0.7, 0.8, 8]} />
      <meshStandardMaterial
        color={modelColor}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
}

function Plate() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <cylinderGeometry args={[1.5, 1.6, 0.2, 64]} />
      <meshStandardMaterial
        color="#f0f0f0"
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}

export function Menu3DScene({ modelColor = '#ff0000' }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ touchAction: 'none' }}
    >
      <Stage environment="city" intensity={0.6}>
        <FoodModel modelColor={modelColor} />
        <Plate />
      </Stage>
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
