import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";

import "./SceneRenderer.css";

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  return (
    <div className="canvas-container">
      <Canvas className="canvas" camera={{ position: [8, 8, 8] }}>
        <fog attach="fog" args={["grey", 2, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={0.5}
          castShadow
          shadow-mapSize-height={1512}
          shadow-mapSize-width={1512}
        />
        <Draggable3DModel
          setIsDragging={setIsDragging}
          floorPlane={floorPlane}
        />
        <Plane />
        <planeHelper args={[floorPlane, 5, 0xddeee]} />
        <primitive object={new THREE.AxesHelper(10)} />
        <gridHelper args={[100, 100, 0x888888]} />
        <gridHelper args={[100, 4, 0x222222]} />
        <OrbitControls minZoom={10} maxZoom={50} enabled={!isDragging} />
      </Canvas>
      ,
    </div>
  );
};

export default SceneRenderer;
