import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3, Mesh } from "three";
import debounce from "lodash/debounce";

import { loader, getObj } from "../../service/scene-renderer";
import { JSXModelComponents } from "../../provider/mock";

interface OrgColors {
  initiated: boolean;
  values: any[];
}
const RenderModel = (props: any) => {
  const { model, ...rest } = props;
  const obj = getObj(
    model,
    useLoader(loader(model), "/assets/" + model.type + "/" + model.file_name)
  );
  const CustomTag =
    JSXModelComponents[model?.file_name?.replace(/\.[^/.]+$/, "") || "Soldier"];

  return (
    <>
      {!model.useJSX && <primitive object={obj} scale={0.1} />}
      {model.useJSX && <CustomTag></CustomTag>}
    </>
  );
};

const Draggable3DModel = (props: any) => {
  const {
    setIsDragging,
    model,
    color,
    floorPlane,
    onSelectedModel,
    updateModel,
    ...rest
  } = props;
  const ref = useRef<any>();

  const [position, setPosition] = useState([0, 0, 0]);
  const [firstPos, setFirstPos] = useState<any>(model.position);
  const [originColors, setOrgColors] = useState<OrgColors>({
    initiated: false,
    values: [],
  });

  const { gl, mouse, camera } = useThree();

  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
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
    setObjectColor(color);
  }, [color]);

  const initiateOrgColors = () => {
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
    setOrgColors({
      initiated: true,
      values,
    });
  };

  const setObjectColor = (color: string) => {
    if (ref) {
      if (color) {
        if (!originColors.initiated) {
          initiateOrgColors();
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
            const meshColor = originColors.values.find(
              (val) => val.index === index
            )?.color;
            meshColor && mesh.material.color.set("#" + meshColor);
            index++;
          }
        });
      }
    }
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
      <RenderModel model={model} />
    </animated.group>
  );
};

export default Draggable3DModel;
