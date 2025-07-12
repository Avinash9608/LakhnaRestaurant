
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import type { Group, Mesh } from 'three';
import React from 'react';
import * as THREE from 'three';

function Pot() {
  return (
    <group>
      {/* Pot Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 1.1, 1, 32]} />
        <meshStandardMaterial color="gray" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pot Rim */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 32]} />
        <meshStandardMaterial color="darkgray" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Water */}
       <mesh position={[0, 0.55, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.95, 32]} />
        <meshStandardMaterial color="hsl(var(--primary))" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function SteamParticle({ initialPosition }: { initialPosition: THREE.Vector3 }) {
    const meshRef = useRef<Mesh>(null!);
    
    const speed = useMemo(() => 0.5 + Math.random() * 0.5, []);
    const scale = useMemo(() => 0.05 + Math.random() * 0.1, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.y += speed * delta;
            meshRef.current.position.x += Math.sin(state.clock.elapsedTime + initialPosition.x) * 0.1 * delta;
            meshRef.current.position.z += Math.cos(state.clock.elapsedTime + initialPosition.z) * 0.1 * delta;

            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.opacity = Math.max(0, 1 - (meshRef.current.position.y - 1) / 3);

            if (meshRef.current.position.y > 4) {
                meshRef.current.position.y = 1;
                material.opacity = 1;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={initialPosition}>
            <sphereGeometry args={[scale, 8, 8]} />
            <meshStandardMaterial color="white" transparent opacity={1} emissive="white" emissiveIntensity={0.5} />
        </mesh>
    );
}

function Steam() {
    const particles = useMemo(() => {
        return Array.from({ length: 50 }).map(() => {
            const x = (Math.random() - 0.5) * 1.5;
            const y = 1 + Math.random();
            const z = (Math.random() - 0.5) * 1.5;
            return new THREE.Vector3(x, y, z);
        });
    }, []);

    return (
        <group>
            {particles.map((pos, i) => (
                <SteamParticle key={i} initialPosition={pos} />
            ))}
        </group>
    );
}


function Stove() {
    return (
        <group>
             {/* Burner */}
            <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <torusGeometry args={[1.5, 0.1, 16, 100]} />
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Flames */}
             <Float speed={2} floatIntensity={0.1}>
                 <mesh>
                    <torusGeometry args={[1.5, 0.05, 16, 100]} />
                    <meshStandardMaterial color="hsl(var(--accent))" emissive="hsl(var(--accent))" emissiveIntensity={2} toneMapped={false}/>
                 </mesh>
            </Float>
        </group>
    )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 60 }}
      className="opacity-90"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={150} color="hsl(var(--primary))" />
      <pointLight position={[-5, 5, -5]} intensity={100} color="hsl(var(--accent))" />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1}
        color="#ffffff"
      />
      
      <group position={[0, -1, 0]}>
        <Pot />
        <Steam />
        <Stove />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </Canvas>
  );
}
