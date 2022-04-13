import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3, Mesh } from "three";
import RenderModel from "./models/RenderModel";
import {
  COMMIT_CONTROL_ACTION,
  Emitter,
  EMIT_KEY_LEFT,
  EMIT_KEY_LEFT_UP,
  EMIT_KEY_RIGHT,
  EMIT_KEY_RIGHT_UP,
} from "../../service";
import { debounce } from "lodash";

import {
  BodyType,
  Physics,
  PhysicsStats,
  ShapeType,
  useRigidBody,
} from "use-ammojs";

interface OrgColor {
  initiated: boolean;
  values: any[];
}

const Draggable3DModel = (props: any) => {
  const {
    setIsDragging,
    onSelectedModel,
    model,
    isSelected,
    updateModel,
    floorPlane,
    controlEvent,
    ...rest
  } = props;

  // const ref = useRef<any>();
  const { gl, mouse, camera } = useThree();

  const cacluate3DPosFrom2DPos = (pos: any): number[] => {
    const planeIntersectPoint = new Vector3(0, 0, 0);
    var raycaster = new Raycaster();
    mouse.set(
      (pos.x / gl.domElement.clientWidth) * 2 - 1,
      -(pos.y / gl.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(floorPlane, planeIntersectPoint);
    return [planeIntersectPoint.x, planeIntersectPoint.y, 0];
  };

  const threeDPos = cacluate3DPosFrom2DPos(model.position);
  const [rigRef] = useRigidBody(() => ({
    bodyType: BodyType.DYNAMIC,
    shapeType: ShapeType.BOX,
    position: new Vector3(threeDPos[0], threeDPos[1], threeDPos[2]),
  }));

  const moveToNewPos = (
    threeDPos: any,
    rotation: any = null,
    immediate: boolean = true
  ) => {
    api.start({
      position: threeDPos,
      ...(rotation && { rotation }),
      immediate,
      config: {
        tension: 50,
      },
    });
  };

  const [animationExist, setAnimationExist] = useState(false);
  const [controlModel, setControlModel] = useState();

  const [position, setPosition] = useState(model.position); // 2D Temp Position
  const [originColor, setOrgColor] = useState<OrgColor>({
    initiated: false,
    values: [],
  });

  const [spring, api] = useSpring(() => ({
    position: cacluate3DPosFrom2DPos(model.position),
    scale: 1,
    rotation: model.rotation || [0, 0, 0],
    immediate: true,
  }));

  const debounceUpdateModel = useCallback(
    debounce((position = null, rotation = null) => {
      updateModel({
        uuid: model.uuid,
        ...(position && { position }),
        ...(rotation && { rotation }),
      });
    }, 800),
    []
  );

  const [accel, setAccel] = useState(0);
  const doLeftAction = useCallback(() => {
    const newAccel = updateAccel();
    console.log("left-action");

    const newTempPos = {
      x: position.x - newAccel,
      y: position.y,
    };
    const rotation = [0, -Math.PI / 2, 0];
    setPosition(newTempPos);
    moveToNewPos(cacluate3DPosFrom2DPos(newTempPos), rotation, false);
    debounceUpdateModel(newTempPos, rotation);
  }, [position.x, accel]);

  const doRightAction = useCallback(() => {
    const newAccel = updateAccel();
    console.log("right-action");

    const newTempPos = {
      x: position.x + newAccel,
      y: position.y,
    };
    const rotation = [0, Math.PI / 2, 0];
    setPosition(newTempPos);
    moveToNewPos(cacluate3DPosFrom2DPos(newTempPos), rotation, false);
    debounceUpdateModel(newTempPos, rotation);
  }, [position.x, accel]);

  const updateAccel = useCallback(() => {
    let newAccel = accel;
    if (accel < 20) {
      newAccel = accel + Math.random() * 0.5;
    } else {
      newAccel = accel - Math.random() * 8;
    }
    setAccel(newAccel);
    return newAccel;
  }, [accel]);

  const stopping = useCallback(
    (oldAccel = accel) => {
      let newAccel = 0;
      if (oldAccel > 0) {
        newAccel = Math.max(oldAccel - Math.random() * 3, 0);
      } else newAccel = 0;
      setAccel(newAccel);
      if (newAccel > 0) {
        setTimeout(() => {
          stopping(newAccel);
        }, 100);
      }
    },
    [accel]
  );

  useEffect(() => {
    Emitter.on(EMIT_KEY_LEFT, () => {
      isSelected && doLeftAction();
    });
    Emitter.on(EMIT_KEY_RIGHT, () => {
      isSelected && doRightAction();
    });
    Emitter.on(EMIT_KEY_LEFT_UP, () => {
      isSelected && stopping();
    });
    Emitter.on(EMIT_KEY_RIGHT_UP, () => {
      isSelected && stopping();
    });
    Emitter.on(COMMIT_CONTROL_ACTION, (payload) => {
      isSelected && setControlModel(payload);
    });
    return () => {
      Emitter.offAll(EMIT_KEY_LEFT);
      Emitter.offAll(EMIT_KEY_RIGHT);
      Emitter.offAll(EMIT_KEY_LEFT_UP);
      Emitter.offAll(EMIT_KEY_RIGHT_UP);
      Emitter.offAll(COMMIT_CONTROL_ACTION);
    };
  }, [isSelected, doLeftAction, doRightAction, stopping]);

  const debounceEmitOnSelect = useCallback(
    debounce((uuid: string) => {
      onSelectedModel(uuid);
    }, 300),
    []
  );

  const onClick = (event: React.PointerEvent<HTMLElement>) => {
    debounceEmitOnSelect(model.uuid);
  };

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      if (!position) return;
      setIsDragging(active);
      const newPos = { x: position?.x + x, y: position?.y + y };
      const calcPos = cacluate3DPosFrom2DPos(newPos);
      if (!active) {
        setPosition(newPos);
        debounceUpdateModel(newPos);
      }
      moveToNewPos(calcPos, null, true);
      debounceEmitOnSelect(model.uuid);
      return timeStamp;
    },
    { delay: true }
  );

  useEffect(() => {
    isSelected && setObjectColor(model.color);
  }, [model.color, isSelected]);

  useEffect(() => {
    updateModel({
      uuid: model.uuid,
      animation: animationExist,
    });
  }, [animationExist]);

  const initiateOrgColor = () => {
    const values: any = [];
    let index = 0;
    const ref: any = rigRef;

    ref.current.traverse(function (mesh: any) {
      if (mesh instanceof Mesh) {
        values.push({
          index,
          color: mesh.material.color.getHexString(),
        });
        index++;
      }
    });
    setOrgColor({
      initiated: true,
      values,
    });
  };

  const setObjectColor = (color: string) => {
    const ref: any = rigRef;
    if (ref) {
      if (color) {
        if (!originColor.initiated) {
          initiateOrgColor();
        }
        ref.current.traverse(function (mesh: any) {
          if (mesh instanceof Mesh) {
            mesh.material.color.set(color);
          }
        });
      } else {
        let index = 0;
        ref.current.traverse(function (mesh: any) {
          if (mesh instanceof Mesh) {
            const meshColor = originColor.values.find(
              (val) => val.index === index
            )?.color;
            meshColor && mesh.material.color.set("#" + meshColor);
            index++;
          }
        });
      }
    }
  };

  return (
    <animated.group
      onClick={onClick}
      {...rest}
      {...spring}
      {...bind()}
      castShadow
      receiveShadow
      ref={rigRef}
    >
      <RenderModel
        model={model}
        accel={accel}
        controlEvent={controlEvent}
        controlModel={controlModel}
        setAnimationExist={setAnimationExist}
      />
    </animated.group>
  );
};

export default Draggable3DModel;
