'use client'

import { Project } from '@/app/_types/project'
import {
  ArcballControls,
  Billboard,
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
import { Canvas, Vector3 } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import * as THREE from 'three'

const Box = ({
  project,
}: {
  project: Project,
}) => {
  const meshRef = useRef<THREE.Mesh>()
  const router = useRouter()

  return (
    <mesh
      position={project.embedding as Vector3}
      // @ts-ignore
      ref={meshRef}
      onClick={() => { router.push(`/projects/${project.id}`) }}
    >
      <sphereGeometry />
      <meshStandardMaterial emissive="skyblue" emissiveIntensity={5} />
      <Billboard>
        <Text
          fontSize={1}
          maxWidth={12}
          anchorY="top"
          overflowWrap="break-word"
        >
          {project.name}
        </Text>
      </Billboard>
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
        {/* @ts-ignore */}
        {projects.map((project, i) => (
          <Box key={i} project={project} />
        ))}
      </Canvas>
    </>
  )
}

export default Explore
