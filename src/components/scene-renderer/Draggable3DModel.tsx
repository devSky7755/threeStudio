import React, { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";

const Draggable3DModel = (props: any) => {
  const planeIntersectPoint = new THREE.Vector3(0, 0, 0);

  const ref = useRef();
  const [position, setPosition] = useState([0, 1, 0]);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));

  // useFrame(() => {
  //   const node: any = ref?.current;
  //   if (node && node?.rotation) {
  //     node.rotation.x += 0.01;
  //   }
  // });

  // const bind = useDrag(
  //   ({ active, movement: [mx, my], timeStamp, event }) => {
  //     props.setIsDragging(active);
  //     const rayEvent: any = event;
  //     if (active) {
  //       rayEvent.ray.intersectPlane(props.floorPlane, planeIntersectPoint);
  //       setPosition([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
  //     }
  //   },
  //   { pointerEvents: true }
  // );

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      props.setIsDragging(active);
      const rayEvent: any = event;
      if (active) {
        rayEvent.ray.intersectPlane(props.floorPlane, planeIntersectPoint);
        setPosition([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
      }

      api.start({
        position: position,
        scale: active ? 1.2 : 1,
        rotation: [y / aspect, x / aspect, 0],
      });
      return timeStamp;
    },
    { delay: true }
  );

  return (
    <animated.mesh {...props} {...spring} {...bind()} ref={ref}>
      <dodecahedronGeometry attach="geometry" args={[1.4, 0]} />
      <meshLambertMaterial attach="material" color="hotpink" />
    </animated.mesh>
    // <mesh {...props} position={position} {...bind()} ref={ref}>
    //   <dodecahedronBufferGeometry attach="geometry" />
    //   <meshLambertMaterial attach="material" color="hotpink" />
    // </mesh>
  );
};

export default Draggable3DModel;
