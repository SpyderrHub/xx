'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Advanced StarField Component
 * Features depth-based motion, mouse-reactive parallax, and subtle twinkle effects.
 */
export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Stars Geometry - Multi-sized for depth
    const starsCount = 4000;
    const posArray = new Float32Array(starsCount * 3);
    const scaleArray = new Float32Array(starsCount);
    
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    for (let i = 0; i < starsCount; i++) {
      scaleArray[i] = Math.random();
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    // Custom Shader Material for Twinkle Effect
    const starsMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
      },
      vertexShader: `
        attribute float aScale;
        varying float vScale;
        void main() {
          vScale = aScale;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aScale * (30.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vScale;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float strength = 0.05 / dist - 0.1;
          float twinkle = sin(uTime * 2.0 + vScale * 100.0) * 0.5 + 0.5;
          gl_FragColor = vec4(uColor, strength * twinkle);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    camera.position.z = 3;

    // Animation & Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      starsMaterial.uniforms.uTime.value = elapsedTime;

      // Smooth damping for mouse motion
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      starsMesh.rotation.y = targetX * 0.5;
      starsMesh.rotation.x = -targetY * 0.5;
      
      // Constant orbital drift
      starsMesh.rotation.z += 0.0001;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-20 pointer-events-none opacity-60 bg-[#0B0B0F]"
      style={{ mixBlendMode: 'lighten' }}
    />
  );
}
