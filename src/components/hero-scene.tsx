'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef } from 'react';
import type { Group } from 'three';
import { Fork, Knife, Spoon } from 'lucide-react';

const SvgShape = ({ shape, color, ...props }: any) => {
  return (
    <group {...props}>
      <mesh>
        <extrudeGeometry args={[shape, { depth: 8, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
      </mesh>
    </group>
  );
};

const UtensilIcon = ({ icon: Icon, ...props }: any) => {
  const Svg = Icon as any;
  const a = Svg({}).props.children[0].props.d;
  const b = Svg({}).props.children[1]?.props.d;

  return (
    <group {...props}>
      {a && (
        <mesh>
          <meshBasicMaterial color="hotpink" />
        </mesh>
      )}
    </group>
  );
};

function RestaurantIcons() {
  const groupRef = useRef<Group>(null!);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <group position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <UtensilIcon icon={Fork} />
        </group>
        <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <UtensilIcon icon={Knife} />
        </group>
        <group position={[2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <UtensilIcon icon={Spoon} />
        </group>
      </Float>
    </group>
  );
}

function FloatingUtensils() {
  const groupRef = useRef<Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
  });

  const Icon = ({
    icon,
    position,
    rotation,
  }: {
    icon: React.ElementType;
    position: [number, number, number];
    rotation: [number, number, number];
  }) => (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} rotation={rotation}>
        {React.createElement(icon, {
          className: 'h-48 w-48 text-primary',
          strokeWidth: 1,
        })}
      </group>
    </Float>
  );

  return (
    <group ref={groupRef}>
      <mesh position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial color="hsl(var(--primary))" metalness={0.6} roughness={0.2} />
      </mesh>
       <mesh position={[2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial color="hsl(var(--accent))" metalness={0.6} roughness={0.2}/>
      </mesh>
       <mesh position={[0, 0, -2]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="hsl(var(--secondary))" metalness={0.8} roughness={0.1}/>
      </mesh>
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
      <FloatingUtensils />
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
