import React, { useRef, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Vector3 } from "three";

import { loader, getObj } from "../../service/scene-renderer";

const Draggable3DModel = (props: any) => {
  const { setIsDragging, selModel, floorPlane } = props;

  const ref = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const { size, viewport } = useThree();

  const loadedModel: any = useLoader(
    loader(selModel),
    "/assets/" + selModel.type + "/" + selModel.file_name,
    () => {}
  );
  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));

  const planeIntersectPoint = new Vector3(0, 0, 0);
  const aspect = size.width / viewport.width;
  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      setIsDragging(active);
      const rayEvent: any = event;
      if (active) {
        rayEvent.ray.intersectPlane(floorPlane, planeIntersectPoint);
        setPosition([planeIntersectPoint.x, planeIntersectPoint.y, 0]);
      }

      api.start({
        position: position,
        scale: active ? 1.2 : 1,
        // rotation: [y / aspect, x / aspect, 0],
      });
      return timeStamp;
    },
    { delay: true }
  );

  return (
    <animated.group
      ref={ref}
      {...props}
      {...spring}
      {...bind()}
      castShadow
      receiveShadow
    >
      <primitive object={getObj(selModel, loadedModel)} scale={0.5} />
    </animated.group>
  );
};

export default Draggable3DModel;
