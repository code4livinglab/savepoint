'use client'

import { Project } from '@/app/_types/project'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>()
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial />
    </mesh>
  )
}

const Explore = ({
  projects,
}: {
  prjects: Project[],
}) => {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} />
      {/* <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      {projects.map((project) => (
        <Box position={project.embedding} />
      ))}
    </Canvas>
  )
}

export default Explore
