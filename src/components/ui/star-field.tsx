
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Stars Geometry
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Stars Material
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#ffffff',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Stars Points
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    camera.position.z = 2;

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth rotation based on mouse or constant drift
      starsMesh.rotation.y += 0.0005;
      starsMesh.rotation.x += 0.0003;

      // React to mouse movement
      starsMesh.rotation.y += (mouseX - starsMesh.rotation.y) * 0.05;
      starsMesh.rotation.x += (mouseY - starsMesh.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-20 pointer-events-none opacity-40 bg-[#0B0B0F]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
