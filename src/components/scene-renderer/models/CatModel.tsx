/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props: any) {
  const { setAnimationExist, ...rest } = props;

  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/assets/glb/Cat.glb");
  const tNodes: any = nodes;

  useEffect(() => {
    setAnimationExist(animations.length > 0);
  }, [animations, setAnimationExist]);

  return (
    <group ref={group} {...rest} dispose={null} scale={0.05}>
      <mesh
        castShadow
        receiveShadow
        geometry={tNodes.Body.geometry}
        material={tNodes.Body.material}
        position={[0, 12.5, 0]}
        scale={7.42}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Arms.geometry}
          material={tNodes.Arms.material}
          position={[0.89, -0.2, -0.12]}
          rotation={[0, 0, 0.19]}
          scale={0.34}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Claws_arms.geometry}
            material={tNodes.Claws_arms.material}
            position={[-0.04, -2.46, -0.48]}
            rotation={[0.05, 0.25, 0.06]}
            scale={0.28}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Belly.geometry}
          material={materials.belly}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Marks_belly.geometry}
            material={tNodes.Marks_belly.material}
            position={[0, -0.11, 0.88]}
            rotation={[-0.52, 0, 0]}
            scale={[0.11, 0.04, 0.01]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Marks_belly001.geometry}
            material={tNodes.Marks_belly001.material}
            position={[0.43, -0.3, 0.86]}
            rotation={[-0.42, 0.43, 0.18]}
            scale={[0.11, 0.04, 0.01]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Ears.geometry}
          material={tNodes.Ears.material}
          position={[0.44, 0.93, 0]}
          rotation={[0, 0, -0.27]}
          scale={[0.05, 0.05, 0.05]}
        />
        <group
          position={[0.46, 0.32, 0.78]}
          rotation={[-0.24, 0.63, -0.11]}
          scale={[0.11, 0.11, 0.05]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Sphere.geometry}
            material={materials["eyes | sclera"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Sphere_1.geometry}
            material={materials["eyes | pupil"]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Feet.geometry}
          material={tNodes.Feet.material}
          position={[0.26, -1.5, -0.12]}
          rotation={[0, -1.19, 1.63]}
          scale={[0.24, 0.18, 0.24]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Claws_feet.geometry}
            material={tNodes.Claws_feet.material}
            position={[-0.72, -2.4, -0.04]}
            rotation={[0.12, 0.19, -0.22]}
            scale={[0.36, 0.58, 0.32]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Leaf_hat.geometry}
          material={materials["leaf | body"]}
          position={[0, 0.92, 0]}
          scale={0.41}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={tNodes.Stalk.geometry}
            material={materials["leaf | stalk"]}
            position={[0.01, 0.41, -1.3]}
            rotation={[0.08, 0, 0]}
            scale={[0.15, 0.08, 0.59]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Nose.geometry}
          material={materials.nose}
          position={[0, 0.38, 0.8]}
          rotation={[1.01, 0, 0]}
          scale={[0.13, 0.12, 0.09]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Tail.geometry}
          material={tNodes.Tail.material}
          position={[0, -1.34, -0.86]}
          scale={[0.31, 0.31, 0.4]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={tNodes.Whiskers.geometry}
          material={materials.whiskers}
          position={[0.42, 0.2, 0.4]}
          rotation={[0, 0.35, -0.05]}
          scale={[0.04, 0.04, 0.04]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/assets/glb/Cat.glb");
