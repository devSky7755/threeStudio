import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { IDLE_ACTION, WALK_ACTION } from "../../../service/emit-actions";
import {
  Emitter,
  EMIT_TIME_SCALE_CHANGED_BY_CONTROL,
  EMIT_WEIGHT_CHANGED,
  EMIT_WEIGHT_CHANGED_BY_CONTROL,
} from "../../../service";

export default function SoldierModel(props: any) {
  const { setAnimationExist, controlEvent, controlModel, ...rest } = props;

  const group = useRef();
  // useHelper(controlEvent?.show_skt && group, THREE.SkeletonHelper);
  const { scene, nodes, materials, animations } = useGLTF(
    "/assets/glb/Soldier.glb"
  );
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [stepSize, setStepSize] = useState<number>(0.5);
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

  const toSingleStep = () => {
    continueModel();
    setStepSize(controlEvent?.single_step?.size_of_next);
  };

  useEffect(() => {
    setAnimationExist(animations.length > 0);
  }, [animations, setAnimationExist]);

  useEffect(() => {
    controlEvent?.activate_all && activateAllActions();
    !controlEvent?.activate_all && deActivateAllActions();
  }, [controlEvent?.activate_all, activateAllActions, deActivateAllActions]);

  useEffect(() => {
    controlEvent?.continue_model && continueModel();
    !controlEvent?.continue_model && pauseModel();
  }, [controlEvent?.continue_model, continueModel, pauseModel]);

  useEffect(() => {
    controlEvent?.single_step?.enabled && toSingleStep();
  }, [controlEvent?.single_step?.enabled, controlEvent?.single_step?.event]);

  useEffect(() => {
    if (!controlModel?.action) return;
    const startAction = getAction(controlModel.action.start);
    const endAction = getAction(controlModel.action.end);
    if (controlModel.action.start === IDLE_ACTION) {
      executeCrossFade(startAction, endAction);
    } else {
      synchronizeCrossFade(startAction, endAction);
    }
  }, [controlModel]);

  const synchronizeCrossFade = (
    startAction: THREE.AnimationAction,
    endAction: THREE.AnimationAction
  ) => {
    const onLoopFinished = (event: any) => {
      if (event.action === startAction) {
        mixer.removeEventListener("loop", onLoopFinished);
        executeCrossFade(startAction, endAction);
      }
    };
    mixer.addEventListener("loop", onLoopFinished);
  };

  const executeCrossFade = (
    startAction: THREE.AnimationAction,
    endAction: THREE.AnimationAction
  ) => {
    setWeight(endAction, 1);
    endAction.time = 0;
    startAction.crossFadeTo(endAction, controlModel.duration, true);
  };

  const getAction = (action: string) => {
    return action === WALK_ACTION
      ? walkAction
      : action === IDLE_ACTION
      ? idleAction
      : runAction;
  };

  const vanguardMesh: any = nodes.vanguard_Mesh;
  const vanguardVisor: any = nodes.vanguard_visor;

  const setWeight = (action: THREE.AnimationAction, weight: number) => {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  };

  useFrame((state, delta) => {
    if (controlEvent?.single_step?.enabled) {
      mixer.update(stepSize);
      setStepSize(0);
    } else mixer.update(delta);
    const idleWeight = idleAction.getEffectiveWeight();
    const walkWeight = walkAction.getEffectiveWeight();
    const runWeight = runAction.getEffectiveWeight();
    Emitter.emit(EMIT_WEIGHT_CHANGED, {
      idle: idleWeight,
      walk: walkWeight,
      run: runWeight,
    });
  });

  useEffect(() => {
    Emitter.on(EMIT_WEIGHT_CHANGED_BY_CONTROL, (weights) => {
      setWeight(walkAction, weights.walk);
      setWeight(idleAction, weights.idle);
      setWeight(runAction, weights.run);
    });
    Emitter.on(EMIT_TIME_SCALE_CHANGED_BY_CONTROL, (conf) => {
      mixer.timeScale = conf.timeScale;
    });
    return () => {
      Emitter.offAll(EMIT_WEIGHT_CHANGED_BY_CONTROL);
      Emitter.offAll(EMIT_TIME_SCALE_CHANGED_BY_CONTROL);
    };
  }, []);

  return (
    <group ref={group} {...rest} dispose={null}>
      <group name="Scene" visible={controlEvent?.show_model}>
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
