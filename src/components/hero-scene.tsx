
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import { useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';
import React from 'react';

// A single chopped piece
function ChoppedPiece({
  initialPosition,
  initialVelocity,
}: {
  initialPosition: THREE.Vector3;
  initialVelocity: THREE.Vector3;
}) {
  const meshRef = useRef<Mesh>(null!);
  const velocity = useRef(initialVelocity);
  const rotationSpeed = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    )
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Apply gravity
      velocity.current.y -= 9.8 * delta;

      meshRef.current.position.add(
        velocity.current.clone().multiplyScalar(delta)
      );
      meshRef.current.rotation.x += rotationSpeed.current.x;
      meshRef.current.rotation.y += rotationSpeed.current.y;

      // Fade out and remove
      if (meshRef.current.position.y < -2) {
        (
          meshRef.current.material as THREE.MeshStandardMaterial
        ).opacity -= 0.05;
        if ((meshRef.current.material as THREE.MeshStandardMaterial).opacity <= 0) {
          // De-render logic can be handled by parent state
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
      <meshStandardMaterial
        color="hsl(var(--accent))"
        roughness={0.6}
        transparent
      />
    </mesh>
  );
}

// The main chopping animation scene
function ChoppingScene() {
  const knifeRef = useRef<Group>(null!);
  const carrotRef = useRef<Mesh>(null!);
  const [choppedPieces, setChoppedPieces] = useState<React.ReactNode[]>([]);
  const chopTime = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    chopTime.current += delta;

    // Knife animation
    if (knifeRef.current) {
      const chopSpeed = 3;
      const angle = Math.sin(t * chopSpeed * Math.PI) * 0.6 + 0.2; // From 0.8 down to -0.4
      knifeRef.current.rotation.z = angle;
      knifeRef.current.position.y = 0.5 + Math.sin(t * chopSpeed * Math.PI) * 0.5;
    }

    // Carrot scaling and spawning pieces
    if (carrotRef.current && chopTime.current > 1 / 3) {
      chopTime.current = 0;

      // Make carrot shorter
      const newScaleX = Math.max(0.1, carrotRef.current.scale.x - 0.05);
      carrotRef.current.scale.x = newScaleX;
      if (carrotRef.current.scale.x <= 0.1) {
        setTimeout(() => {
          if (carrotRef.current) carrotRef.current.scale.x = 1; // Reset after a delay
        }, 500);
      }

      // Spawn a new piece
      const newPiece = {
        id: t,
        position: new THREE.Vector3(
          1.1 * newScaleX - 0.5,
          0.2,
          (Math.random() - 0.5) * 0.1
        ),
        velocity: new THREE.Vector3(
          -0.5 + Math.random() * -1,
          2 + Math.random() * 2,
          (Math.random() - 0.5) * 2
        ),
      };

      setChoppedPieces(prev => {
        const newPieces = [
          ...prev,
          <ChoppedPiece
            key={newPiece.id}
            initialPosition={newPiece.position}
            initialVelocity={newPiece.velocity}
          />,
        ];
        // Remove old pieces that have faded out
        return newPieces.slice(-30);
      });
    }
  });

  return (
    <group>
      {/* Cutting Board */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[3, 0.2, 1.5]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* Carrot */}
      <mesh ref={carrotRef} position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 1, 16]} />
        <meshStandardMaterial color="hsl(var(--accent))" />
      </mesh>

      {/* Knife */}
      <group ref={knifeRef} position={[0.5, 1, 0]}>
        <group position={[0.5, 0, 0]}>
          {/* Blade */}
          <mesh castShadow>
            <boxGeometry args={[1, 0.4, 0.05]} />
            <meshStandardMaterial
              color="#B0C4DE"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Handle */}
          <mesh position={[-0.7, 0.1, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.08]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Container for chopped pieces */}
      <group>{choppedPieces}</group>
    </group>
  );
}

// Floating Tomato
function FloatingTomato() {
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={0.5}>
      <mesh position={[-2.5, 1.2, -1]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#E2725B" roughness={0.5} />
      </mesh>
    </Float>
  );
}

// Floating Mushroom
function FloatingMushroom() {
  return (
    <Float speed={1.2} rotationIntensity={1} floatIntensity={0.6}>
      <group position={[2.8, 1.5, -1.2]}>
        <mesh castShadow>
          {/* Cap */}
          <cylinderGeometry args={[0.3, 0.35, 0.15, 20]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          {/* Stem */}
          <cylinderGeometry args={[0.12, 0.08, 0.3, 12]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 7], fov: 60 }}
      shadows
      className="opacity-90"
    >
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, -5]} intensity={50} color="hsl(var(--accent))" />
      <pointLight position={[-5, 3, 5]} intensity={30} color="hsl(var(--primary))" />

      <ChoppingScene />
      <FloatingTomato />
      <FloatingMushroom />

      <Sparkles
        count={80}
        scale={6}
        size={3}
        speed={0.3}
        position={[0, 1, -2]}
        color="hsl(var(--primary))"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
}
