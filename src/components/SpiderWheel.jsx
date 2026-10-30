import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SpiderSphere from './SpiderSphere';

/**
 * Horizontal 3D Rotating Carousel of 4 Spider-Men spheres on the XZ plane.
 * Rotates along the Y-axis driven by GSAP ScrollTrigger via scrollStateRef.
 * Spheres enter from the right, move into the center focus, and exit to the left.
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

  // Sphere positions spaced at 90 degrees in the horizontal XZ plane (carousel formation)
  // Sphere 0 (Tobey): [0, 0, radius] -> Exact front center on load
  // Sphere 1 (Andrew): [radius, 0, 0] -> Enters from the right into center
  // Sphere 2 (Tom): [0, 0, -radius] -> Enters from the right after Andrew
  // Sphere 3 (Miles): [-radius, 0, 0] -> Enters from the right and ends at front center
  const spherePositions = useMemo(() => {
    return [
      [0, 0, radius],          // 0: Tobey (Front center)
      [radius, 0, 0],          // 1: Andrew (Right)
      [0, 0, -radius],         // 2: Tom (Back)
      [-radius, 0, 0]          // 3: Miles (Left)
    ];
  }, [radius]);

  // Floating multiverse sparks/particles
  const particlePositions = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  // Frame loop for 60/120fps dampening and smooth Y-axis rotation
  useFrame((state, delta) => {
    if (wheelGroupRef.current && scrollStateRef?.current) {
      const { targetRotationY = 0 } = scrollStateRef.current;

      // Smoothly interpolate rotation along Y-axis (carousel rotation)
      wheelGroupRef.current.rotation.y = THREE.MathUtils.damp(
        wheelGroupRef.current.rotation.y,
        targetRotationY,
        8,
        delta
      );

      // Subtle dynamic X tilt (10 degrees) to give deep perspective to the horizontal carousel
      const targetTiltX = 0.18;
      wheelGroupRef.current.rotation.x = THREE.MathUtils.damp(
        wheelGroupRef.current.rotation.x,
        targetTiltX,
        6,
        delta
      );
    }

    // Slowly rotate background multiverse anomaly dust
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
      particlesRef.current.rotation.x += delta * 0.01;
    }

    // Subtle breathing pulse on the horizontal orbital web ring
    if (ringRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.015;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    // On desktop, position the carousel slightly to the right (+0.75)
    // because the UI card is now on the left side!
    <group position={[isMobile ? 0 : 0.75, -0.15, 0]}>
      {/* 
        The main rotating 3D carousel group:
        Rotates on the Y-axis from 0 to -(3 * pi / 2)
      */}
      <group ref={wheelGroupRef} rotation={[0.18, 0, 0]}>
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

        {/* Horizontal Orbital Web Tether Ring (in the XZ plane) */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.024, 16, 120]} />
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
