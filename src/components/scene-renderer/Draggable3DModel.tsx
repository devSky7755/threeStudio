import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3, Mesh } from "three";
import debounce from "lodash/debounce";
import RenderModel from "./models/RenderModel";

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
    ...rest
  } = props;

  const ref = useRef<any>();
  const [animationExist, setAnimationExist] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]); // 3D Position
  const [firstPos, setFirstPos] = useState<any>(model.position);
  const [originColor, setOrgColor] = useState<OrgColor>({
    initiated: false,
    values: [],
  });

  const { gl, mouse, camera } = useThree();

  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: model.rotation || [0, 0, 0],
    config: { friction: 10 },
    immediate: true,
  }));

  useEffect(() => {
    if (model.position) {
      setFirstPos(model.position);
      const calcPos = cacluate3DPosFrom2DPos(model.position);
      moveToNewPos(calcPos);
    }
  }, [model.position]);

  useEffect(() => {
    if (model.rotation) {
      api.start({
        rotation: model.rotation,
        immediate: true,
      });
    }
  }, [model.rotation]);

  const downHandler = ({ key }: { key: string }) => {
    switch (key) {
      case "ArrowLeft":
        isSelected && doLeftAction(model.position);
        break;
      case "ArrowRight":
        isSelected && doRightAction(model.position);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", downHandler);
    return () => {
      document.removeEventListener("keydown", downHandler);
    };
  });

  const doLeftAction = (position: any) => {
    updateModel({
      ...model,
      position: {
        x: position.x - 2,
        y: position.y,
      },
      rotation: [0, -Math.PI / 2, 0],
    });
  };

  const doRightAction = (position: any) => {
    updateModel({
      ...model,
      position: {
        x: position.x + 2,
        y: position.y,
      },
      rotation: [0, Math.PI / 2, 0],
    });
  };

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

  const moveToNewPos = (threeDPos: any) => {
    setPosition(threeDPos);
    api.start({
      position: threeDPos,
      immediate: true,
    });
  };

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      if (!firstPos) return;
      setIsDragging(active);
      const newPos = { x: firstPos?.x + x, y: firstPos?.y + y };
      const calcPos = cacluate3DPosFrom2DPos(newPos);
      if (!active) {
        setFirstPos(newPos);
        updateModel({ ...model, position: newPos });
      }
      moveToNewPos(calcPos);
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
      ...model,
      animation: animationExist,
      control:
        animationExist &&
        (model.control || {
          show_model: true,
          show_skt: false,
          activate_all: true,
          continue_model: true,
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

  const debounceEmitOnSelect = useCallback(
    debounce((uuid: string) => {
      onSelectedModel(uuid);
    }, 300),
    []
  );

  const onClick = (event: React.PointerEvent<HTMLElement>) => {
    debounceEmitOnSelect(model.uuid);
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
      <RenderModel model={model} setAnimationExist={setAnimationExist} />
    </animated.group>
  );
};

export default Draggable3DModel;
