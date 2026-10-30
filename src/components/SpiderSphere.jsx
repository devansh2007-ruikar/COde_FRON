import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createTobeyTexture,
  createAndrewTexture,
  createTomTexture,
  createMilesTexture
} from './sphereTextures';

/**
 * Individual Spider-Man 3D Sphere with distinctive procedural suit texture,
 * metallic reflections, clearcoat, and active focus animations.
 */
export default function SpiderSphere({ id, index, isActive, position, onClick }) {
  const meshRef = useRef();
  const auraRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Generate texture once based on index
  const texture = useMemo(() => {
    switch (index) {
      case 0:
        return createTobeyTexture();
      case 1:
        return createAndrewTexture();
      case 2:
        return createTomTexture();
      case 3:
      default:
        return createMilesTexture();
    }
  }, [index]);

  // Distinct material configs matching user requirements
  const materialProps = useMemo(() => {
    switch (index) {
      case 0:
        // Tobey Maguire: Dark metallic Red and Blue, silver webbing
        return {
          roughness: 0.22,
          metalness: 0.78,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
          reflectivity: 0.85,
          color: new THREE.Color('#ffffff')
        };
      case 1:
        // Andrew Garfield: Sleek Crimson and Deep Navy Blue
        return {
          roughness: 0.16,
          metalness: 0.65,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 0.9,
          color: new THREE.Color('#ffffff')
        };
      case 2:
        // Tom Holland: Vibrant Red with Iron-Spider Gold and Black accents
        return {
          roughness: 0.18,
          metalness: 0.88,
          clearcoat: 0.95,
          clearcoatRoughness: 0.08,
          reflectivity: 0.95,
          color: new THREE.Color('#ffffff')
        };
      case 3:
      default:
        // Miles Morales: Matte Black with glowing/bright Red accents
        return {
          roughness: 0.82, // Matte Black finish!
          metalness: 0.18,
          clearcoat: 0.2,
          clearcoatRoughness: 0.4,
          emissive: new THREE.Color('#ff0938'),
          emissiveIntensity: 0.25,
          color: new THREE.Color('#ffffff')
        };
    }
  }, [index]);

  // Self rotation and active scale animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle self-rotation on Y to showcase all sides of the suit
      meshRef.current.rotation.y += delta * 0.35;

      // Smooth target scale based on active and hover states
      const targetScale = isActive ? (hovered ? 1.12 : 1.06) : (hovered ? 1.04 : 0.95);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }

    if (auraRef.current) {
      // Rotate and pulse active aura ring
      auraRef.current.rotation.z += delta * 0.5;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Aura ring color matching the active Spider-Man
  const auraColor = useMemo(() => {
    switch (index) {
      case 0:
        return '#990011';
      case 1:
        return '#0077ff';
      case 2:
        return '#ffd24c';
      case 3:
      default:
        return '#ff0938';
    }
  }, [index]);

  return (
    <group position={position}>
      {/* 3D Spider-Man Sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.08, 64, 64]} />
        <meshPhysicalMaterial map={texture} {...materialProps} />
      </mesh>

      {/* Dynamic Active Halo / Energy Ring */}
      {isActive && (
        <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.28, 1.34, 48]} />
          <meshBasicMaterial
            color={auraColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Point light localized to active sphere to illuminate reflections */}
      {isActive && (
        <pointLight
          color={auraColor}
          intensity={3.5}
          distance={4}
          decay={2}
          position={[0, 0, 1.5]}
        />
      )}
    </group>
  );
}
