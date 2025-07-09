'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function RotatingKnot() {
  const meshRef = useRef<Mesh>(null!);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <TorusKnot ref={meshRef} args={[1, 0.4, 256, 32]}>
      <meshStandardMaterial color={'#50C878'} roughness={0.1} metalness={0.8} />
    </TorusKnot>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="opacity-50"
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <RotatingKnot />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </Canvas>
  );
}
