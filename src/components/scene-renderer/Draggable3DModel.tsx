import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3, Mesh } from "three";
import debounce from "lodash/debounce";
import RenderModel from "./models/RenderModel";
import Emitter, {
  COMMIT_CONTROL_ACTION,
  EMIT_CONTROL_EVENT,
  EMIT_KEY_LEFT,
  EMIT_KEY_RIGHT,
} from "../../service/emitter";
import { ModelControl } from "../../store/modelReducer";

interface OrgColor {
  initiated: boolean;
  values: any[];
}

const isSameArray = (arr1: Array<any>, arr2: Array<any>): boolean =>
  arr1.length === arr2.length && arr1.every((o, idx) => o === arr2[idx]);

const Draggable3DModel = (props: any) => {
  const {
    setIsDragging,
    onSelectedModel,
    model,
    isSelected,
    updateModel,
    floorPlane,
    ...rest
  } = props;

  const ref = useRef<any>();
  const [animationExist, setAnimationExist] = useState(false);
  const prevModelRotationRef = useRef<Array<any>>([]);
  const [controlEvent, setControlEvent] = useState<ModelControl>();
  const [controlModel, setControlModel] = useState();

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

  const [position, setPosition] = useState(
    cacluate3DPosFrom2DPos(model.position)
  ); // 3D Position
  const [firstPos, setFirstPos] = useState<any>(model.position);
  const [originColor, setOrgColor] = useState<OrgColor>({
    initiated: false,
    values: [],
  });

  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: model.rotation || [0, 0, 0],
    immediate: true,
  }));

  useEffect(() => {
    if (model.position) {
      setFirstPos(model.position);
      moveToNewPos(cacluate3DPosFrom2DPos(model.position), false);
    }
  }, [model.position]);

  useEffect(() => {
    if (!isSameArray(prevModelRotationRef.current, model.rotation)) {
      prevModelRotationRef.current = model.rotation;
      api.start({
        rotation: model.rotation,
        immediate: false,
        config: {
          tension: 100,
        },
      });
    }
  }, [model.rotation]);

  const doLeftAction = useCallback(() => {
    updateModel({
      uuid: model.uuid,
      position: {
        x: model.position.x - 9,
        y: model.position.y,
      },
      rotation: [0, -Math.PI / 2, 0],
    });
  }, [model.uuid, model.position]);

  const doRightAction = useCallback(() => {
    updateModel({
      uuid: model.uuid,
      position: {
        x: model.position.x + 9,
        y: model.position.y,
      },
      rotation: [0, Math.PI / 2, 0],
    });
  }, [model.uuid, model.position]);

  useEffect(() => {
    Emitter.on(EMIT_KEY_LEFT, () => {
      isSelected && doLeftAction();
    });
    Emitter.on(EMIT_KEY_RIGHT, () => {
      isSelected && doRightAction();
    });
    Emitter.on(EMIT_CONTROL_EVENT, (payload) => {
      isSelected &&
        setControlEvent({
          ...payload?.control,
        });
    });
    Emitter.on(COMMIT_CONTROL_ACTION, (payload) => {
      isSelected && setControlModel(payload);
    });
    return () => {
      Emitter.offAll(EMIT_KEY_LEFT);
      Emitter.offAll(EMIT_KEY_RIGHT);
      Emitter.offAll(COMMIT_CONTROL_ACTION);
    };
  }, [isSelected, doLeftAction, doRightAction]);

  const moveToNewPos = (threeDPos: any, immediate: boolean = true) => {
    setPosition(threeDPos);
    api.start({
      position: threeDPos,
      immediate,
      config: {
        tension: 50,
      },
    });
  };

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
      if (!firstPos) return;
      setIsDragging(active);
      const newPos = { x: firstPos?.x + x, y: firstPos?.y + y };
      const calcPos = cacluate3DPosFrom2DPos(newPos);
      if (!active) {
        setFirstPos(newPos);
        updateModel({
          uuid: model.uuid,
          position: newPos,
        });
        api.stop();
      }
      moveToNewPos(calcPos, true);
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
      control:
        animationExist &&
        (model.control || {
          show_model: true,
          show_skt: false,
          activate_all: true,
          continue_model: true,
          single_step: {
            enabled: false,
            event: false,
            size_of_next: 0.05,
          },
        }),
    });
  }, [animationExist]);

  const initiateOrgColor = () => {
    const values: any = [];
    let index = 0;
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
      ref={ref}
    >
      <RenderModel
        model={model}
        controlEvent={controlEvent}
        controlModel={controlModel}
        setAnimationExist={setAnimationExist}
      />
    </animated.group>
  );
};

export default Draggable3DModel;
