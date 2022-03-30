import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function SoldierModel(props: any) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/assets/glb/Soldier.glb");
  const { actions } = useAnimations(animations, group);

  const vanguardMesh: any = nodes.vanguard_Mesh;
  const vanguardVisor: any = nodes.vanguard_visor;

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Character" rotation={[-Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="vanguard_Mesh"
            geometry={vanguardMesh.geometry}
            material={materials.VanguardBodyMat}
            skeleton={vanguardMesh.skeleton}
          />
          <skinnedMesh
            name="vanguard_visor"
            geometry={vanguardVisor.geometry}
            material={materials.Vanguard_VisorMat}
            skeleton={vanguardVisor.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/assets/glb/Soldier.glb");
