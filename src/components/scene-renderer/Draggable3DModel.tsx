import React, { useEffect, useRef, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3 } from "three";

import { loader, getObj } from "../../service/scene-renderer";

const Draggable3DModel = (props: any) => {
  const { setIsDragging, model, floorPlane } = props;
  const ref = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const { gl, mouse, camera, size, viewport } = useThree();

  const aspect = size.width / viewport.width;
  const loadedModel: any = useLoader(
    loader(model),
    "/assets/" + model.type + "/" + model.file_name,
    () => {}
  );
  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));

  const planeIntersectPoint = new Vector3(0, 0, 0);

  useEffect(() => {
    if (model.position) {
      var raycaster = new Raycaster();
      mouse.set(
        (model.position.x / gl.domElement.clientWidth) * 2 - 1,
        -(model.position.y / gl.domElement.clientHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(floorPlane, planeIntersectPoint);
      setPosition([planeIntersectPoint.x, planeIntersectPoint.y, 0]);
      api.start({
        position: [planeIntersectPoint.x, planeIntersectPoint.y, 0],
      });
    }
  }, [model.position]);

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
      <primitive object={getObj(model, loadedModel)} scale={0.5} />
    </animated.group>
  );
};

export default Draggable3DModel;
