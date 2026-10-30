import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SpiderSphere from './SpiderSphere';

/**
 * Vertical 3D Rotating Wheel of 4 Spider-Men spheres in 90-degree depth.
 * Smoothly rotates along the X-axis driven by GSAP ScrollTrigger via scrollStateRef.
 */
export default function SpiderWheel({
  scrollStateRef,
  activeIndex = 0,
  onSphereClick,
  radius = 3.2,
  isMobile = false
}) {
  const wheelGroupRef = useRef();
  const particlesRef = useRef();
  const ringRef = useRef();

  // 4 Spider-Men definitions
  const spiderData = [
    { id: 'tobey', name: 'Tobey Maguire', suit: 'Classic Raimi Suit' },
    { id: 'andrew', name: 'Andrew Garfield', suit: 'The Amazing Suit' },
    { id: 'tom', name: 'Tom Holland', suit: 'Iron Spider Suit' },
    { id: 'miles', name: 'Miles Morales', suit: 'Graffiti Spray Suit' }
  ];

  // Sphere positions spaced at 90 degrees in the Y-Z plane
  // Sphere 0: [0, 0, +R] (front center focus)
  // Sphere 1: [0, -R, 0] (bottom, rolls up into center)
  // Sphere 2: [0, 0, -R] (back depth)
  // Sphere 3: [0, +R, 0] (top)
  const spherePositions = useMemo(() => {
    return [
      [0, 0, radius],          // 0: Tobey (Front center)
      [0, -radius, 0],         // 1: Andrew (Bottom)
      [0, 0, -radius],         // 2: Tom (Back)
      [0, radius, 0]           // 3: Miles (Top)
    ];
  }, [radius]);

  // Multiverse anomaly sparks
  const particlePositions = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  // Frame loop for 60/120fps dampening and smooth X-axis rotation
  useFrame((state, delta) => {
    if (wheelGroupRef.current && scrollStateRef?.current) {
      const { targetY = 0, targetRotationX = 0, progress = 0 } = scrollStateRef.current;

      // 1. Smoothly interpolate vertical position (lifts from bottom)
      wheelGroupRef.current.position.y = THREE.MathUtils.damp(
        wheelGroupRef.current.position.y,
        targetY,
        8,
        delta
      );

      // 2. Smoothly interpolate rotation along X-axis (Ferris wheel rotation)
      wheelGroupRef.current.rotation.x = THREE.MathUtils.damp(
        wheelGroupRef.current.rotation.x,
        targetRotationX,
        8,
        delta
      );

      // 3. Subtle dynamic 3D depth tilt on Y axis for realistic perspective
      const depthTilt = Math.sin(progress * Math.PI) * 0.22;
      wheelGroupRef.current.rotation.y = THREE.MathUtils.damp(
        wheelGroupRef.current.rotation.y,
        depthTilt,
        6,
        delta
      );
    }

    // Float particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
      particlesRef.current.rotation.x += delta * 0.02;
    }

    // Pulse orbital ring
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group position={[isMobile ? 0 : -0.7, 0, 0]}>
      {/* 
        The main rotating 3D Ferris wheel group:
        Initialized at y = -3.2 so only bottom half is visible before scroll!
      */}
      <group ref={wheelGroupRef} position={[0, -3.2, 0]}>
        {/* The 4 Spider-Men Spheres */}
        {spiderData.map((spider, index) => (
          <SpiderSphere
            key={spider.id}
            id={spider.id}
            index={index}
            isActive={activeIndex === index}
            position={spherePositions[index]}
            onClick={() => onSphereClick && onSphereClick(index)}
          />
        ))}

        {/* Vertical Orbital Web Tether Ring (in Y-Z plane) */}
        <mesh ref={ringRef} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius, 0.025, 16, 120]} />
          <meshStandardMaterial
            color="#e23636"
            emissive="#e23636"
            emissiveIntensity={0.8}
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Multiverse anomaly dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#ff2255"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
