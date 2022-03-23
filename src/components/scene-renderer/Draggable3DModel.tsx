import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { Raycaster, Vector3, Mesh } from "three";

import { loader, getObj } from "../../service/scene-renderer";

const Draggable3DModel = (props: any) => {
  const { setIsDragging, model, color, floorPlane, isSelected, ...rest } =
    props;
  const ref = useRef<any>();

  const [position, setPosition] = useState([0, 0, 0]);
  const { gl, mouse, camera } = useThree();
  const loadedModel: any = useLoader(
    loader(model),
    "/assets/" + model.type + "/" + model.file_name
  );
  const obj = getObj(model, loadedModel);

  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
    immediate: true,
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
        immediate: true,
      });
    }
  }, [model.position]);

  useEffect(() => {
    setObjectColor(color);
  }, [color]);

  const setObjectColor = (color: string) => {
    if (ref && color) {
      ref.current.traverse(function (mesh: any) {
        if (mesh instanceof Mesh) {
          mesh.material.color.set(color);
        }
      });
    }
  };

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
        immediate: true,
      });
      return timeStamp;
    },
    { delay: true }
  );

  const onClick = (event: React.PointerEvent<HTMLElement>) => {
    // event.stopPropagation();
    // console.log(event, "down");
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
      <primitive object={obj} scale={0.1} />
    </animated.group>
  );
};

export default Draggable3DModel;
