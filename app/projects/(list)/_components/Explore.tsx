'use client'

import { Project } from '@/app/_types/project'
import {
  ArcballControls,
  GizmoHelper,
  GizmoViewport,
  Instances,
  Loader,
  QuadraticBezierLine,
  ScreenSizer,
  SoftShadows,
  Stars,
  Shadow,
  Text,
  KeyboardControls,
} from '@react-three/drei'
import { Canvas, ThreeElements } from '@react-three/fiber'
import Link from 'next/link'
import React, { useState, useRef } from 'react'
import * as THREE from 'three'

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>()
  const [active, setActive] = useState(false)

  return (
    <mesh
      {...props}
      // @ts-ignore
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <sphereGeometry />
      <meshStandardMaterial emissive="skyblue" emissiveIntensity={5} />
    </mesh>
  )
}

const Explore = ({
  // @ts-ignore
  projects,
}: {
  prjects: Project[],
}) => {
  return (
    <>
      <Canvas>
        <ArcballControls makeDefault />
        <GizmoHelper alignment="bottom-left">
          <GizmoViewport />
        </GizmoHelper>
        <Stars />
        <spotLight position={[0, 0, 0]} intensity={100} />
        <mesh>
          <sphereGeometry args={[10]} />
          <meshStandardMaterial emissive="red" emissiveIntensity={100} />
        </mesh>
        {/* @ts-ignore */}
        {projects.map((project) => (
          <Box position={project.embedding} />
        ))}
      </Canvas>
    </>
  )
}

export default Explore
