import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGLTF, useHelper } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function SoldierModel(props: any) {
  const { modelControl, setAnimationExist, ...rest } = props;

  const group = useRef();
  // useHelper(modelControl.show_skt && group, THREE.SkeletonHelper);
  const { scene, nodes, materials, animations } = useGLTF(
    "/assets/glb/Soldier.glb"
  );
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [idleAction] = useState(mixer.clipAction(animations[0], group.current));
  const [walkAction] = useState(mixer.clipAction(animations[3], group.current));
  const [runAction] = useState(mixer.clipAction(animations[1], group.current));
  const [allActions] = useState([idleAction, walkAction, runAction]);

  const activateAllActions = useCallback(() => {
    setWeight(idleAction, 0);
    setWeight(walkAction, 1);
    setWeight(runAction, 0);
    allActions.forEach((action) => {
      action.play();
    });
  }, [allActions, idleAction, walkAction, runAction]);

  const deActivateAllActions = useCallback(() => {
    allActions.forEach((action) => {
      action.stop();
    });
  }, [allActions]);

  const continueModel = useCallback(() => {
    allActions.forEach((action) => {
      action.paused = false;
    });
  }, [allActions]);

  const pauseModel = useCallback(() => {
    allActions.forEach((action) => {
      action.paused = true;
    });
  }, [allActions]);

  useEffect(() => {
    setAnimationExist(animations.length > 0);
  }, [animations, activateAllActions, setAnimationExist]);

  useEffect(() => {
    modelControl.activate_all && activateAllActions();
    !modelControl.activate_all && deActivateAllActions();
    modelControl.continue_model && continueModel();
    !modelControl.continue_model && pauseModel();
  }, [
    modelControl,
    activateAllActions,
    deActivateAllActions,
    continueModel,
    pauseModel,
  ]);

  const vanguardMesh: any = nodes.vanguard_Mesh;
  const vanguardVisor: any = nodes.vanguard_visor;

  const setWeight = (action: THREE.AnimationAction, weight: number) => {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  };

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <group ref={group} {...rest} dispose={null}>
      <group name="Scene" visible={modelControl?.show_model}>
        <group
          name="Character"
          rotation={[-Math.PI / 2, 0, Math.PI]}
          scale={0.01}
          receiveShadow
        >
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
