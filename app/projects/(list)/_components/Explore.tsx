"use client";

import { Project } from "@/app/_types/project";
import {
  ArcballControls,
  Billboard,
  GizmoHelper,
  GizmoViewport,
  Stars,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";

const Box = ({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const projectId = pathname.split("/").pop();
    if (
      projectId &&
      typeof projectId === "string" &&
      projectId === project.id
    ) {
      onSelect(project);
    }
  }, [router, pathname, project, onSelect]);

  return (
    <mesh
      position={new THREE.Vector3(...project.embedding)}
      ref={meshRef}
      onClick={() => {
        router.push(`/projects/${project.id}`);
      }}
    >
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial emissive="skyblue" emissiveIntensity={5} />
      <Billboard>
        <Text
          fontSize={0.5}
          maxWidth={6}
          anchorY="top"
          overflowWrap="break-word"
        >
          {project.name}
        </Text>
      </Billboard>
    </mesh>
  );
};

const CameraController = ({
  target,
  isMoving,
  onMoveComplete,
}: {
  target: THREE.Vector3 | null;
  isMoving: boolean;
  onMoveComplete: () => void;
}) => {
  const { camera, size } = useThree();
  const moveProgress = useRef(0);
  const startPosition = useRef(new THREE.Vector3());
  const startRotation = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (isMoving && target) {
      startPosition.current.copy(camera.position);
      startRotation.current.copy(camera.quaternion);
      moveProgress.current = 0;
    }
  }, [isMoving, target, camera.position, camera.quaternion]);

  useFrame(() => {
    if (target && isMoving) {
      const offsetX = 0;
      const offsetY = 0;
      const offsetZ = 0;
      const targetPosition = new THREE.Vector3(
        target.x + offsetX,
        target.y + offsetY,
        target.z + offsetZ
      );

      moveProgress.current += 0.02; // 移動速度の調整

      if (moveProgress.current >= 1) {
        camera.position.copy(targetPosition);
        camera.lookAt(target);
        onMoveComplete();
      } else {
        camera.position.lerpVectors(
          startPosition.current,
          targetPosition,
          moveProgress.current
        );
        camera.quaternion.slerpQuaternions(
          startRotation.current,
          new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(targetPosition, target, camera.up)
          ),
          moveProgress.current
        );
      }
    }
  });

  return null;
};

const Explore = ({ projects }: { projects: Project[] }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const params = useParams();

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsMoving(true);
  }, []);

  const handleMoveComplete = useCallback(() => {
    setIsMoving(false);
  }, []);

  useEffect(() => {
    const projectId = params?.id;
    if (projectId && typeof projectId === "string") {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setIsMoving(true);
      }
    }
  }, [params, projects]);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 50]} />
      <ArcballControls makeDefault enabled={!isMoving} />
      <GizmoHelper alignment="bottom-left">
        <GizmoViewport />
      </GizmoHelper>
      <Stars />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CameraController
        target={
          selectedProject
            ? new THREE.Vector3(...selectedProject.embedding)
            : null
        }
        isMoving={isMoving}
        onMoveComplete={handleMoveComplete}
      />
      {projects.map((project, i) => (
        <Box key={i} project={project} onSelect={handleSelectProject} />
      ))}
    </Canvas>
  );
};

export default Explore;
