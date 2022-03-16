import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Box, Sphere } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import {
  Raycaster,
  Vector3,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Box3,
  EdgesGeometry,
  BufferGeometry,
} from "three";

import { loader, getObj } from "../../service/scene-renderer";

import { EffectComposer, Outline } from "@react-three/postprocessing";

const Draggable3DModel = (props: any) => {
  const {
    // index,
    setIsDragging,
    model,
    floorPlane,
    // selectedObject,
    // setSelectedObject,
  } = props;
  const ref = useRef<any>();

  const [position, setPosition] = useState([0, 0, 0]);
  const { scene, gl, mouse, camera, size, viewport } = useThree();
  const loadedModel: any = useLoader(
    loader(model),
    "/assets/" + model.type + "/" + model.file_name
  );
  const obj = getObj(model, loadedModel);
  // console.log(obj);
  // const box = useMemo(() => new Box3().setFromObject(obj), [obj]);
  // const edges = useMemo(
  //   () => new EdgesGeometry(obj.children.slice(-1)[0].geometry),
  //   undefined
  // );
  // console.log(obj.children.slice(-1)[0].geometry);
  const [edges, setEdges] = useState<BufferGeometry>();

  const aspect = size.width / viewport.width;
  const [spring, api] = useSpring(() => ({
    position: position,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
    immediate: true,
  }));

  const planeIntersectPoint = new Vector3(0, 0, 0);

  // const selected = [ref];

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

  // useLayoutEffect(() => {
  //   if (ref) {
  //     // ref.current.traverse(function (mesh: any) {
  //     //   if (mesh instanceof Mesh) {
  //     //     setEdges(mesh.geometry);
  //     //   }
  //     // });
  //     setSelectedObject(ref);
  //   }
  // }, []);

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

  // var hitGeom = new BoxBufferGeometry(1, 1, 1);
  // var hitMat = new MeshBasicMaterial({ visible: true });

  return (
    <animated.group
      {...props}
      {...spring}
      {...bind()}
      castShadow
      receiveShadow
      // onClick={(e: any) => {
      //   selectedObject == ref
      //     ? setSelectedObject(null)
      //     : setSelectedObject(ref);
      //   e.stopPropagation();
      // }}
    >
      <primitive object={obj} scale={0.5} ref={ref} />
      {/* <mesh geometry={hitGeom} material={hitMat} ref={ref} /> */}
      {/* <lineSegments geometry={edges} renderOrder={100} scale={0.5}>
          <lineBasicMaterial color="black" />
        </lineSegments> */}
    </animated.group>
    // { <boxHelper args={[ref, 0xff0000]}></boxHelper> }
  );
};

export default Draggable3DModel;
