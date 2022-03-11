import React, { useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useDrag } from "react-use-gesture";

const Draggable3DModel = (props: any) => {
  const colors = ["hotpink", "red", "blue", "green", "yellow"];
  const ref = useRef();
  const [colorIdx, setColorIdx] = useState(0);
  const [position, setPosition] = useState([0, 0, 0]);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  useFrame(() => {
    const node: any = ref?.current;
    if (node && node?.rotation) {
      node.rotation.z += 0.01;
      node.rotation.x += 0.01;
    }
  });

  const bind = useDrag(
    ({ offset: [x, y] }) => {
      const [, , z] = position;
      setPosition([x / aspect, -y / aspect, z]);
    },
    { pointerEvents: true }
  );

  return (
    <mesh
      {...props}
      position={position}
      {...bind()}
      ref={ref}
      onClick={(e) => {
        if (colorIdx === 4) {
          setColorIdx(0);
        } else {
          setColorIdx(colorIdx + 1);
        }
      }}
      onPointerOver={(e) => console.log("hover")}
      onPointerOut={(e) => console.log("unhover")}
    >
      <dodecahedronBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color={colors[colorIdx]} />
    </mesh>
  );
};

export default Draggable3DModel;
