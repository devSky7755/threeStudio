import React from "react";

const Plane = () => (
  <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[20, 20]} />
    <meshBasicMaterial
      attach="material"
      color="grey"
      opacity={0.5}
      transparent
    />
  </mesh>
);

export default Plane;
