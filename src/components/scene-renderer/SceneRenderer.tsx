import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";

import "./SceneRenderer.css";
import { useSelector } from "react-redux";

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const selModel = useSelector((state: any) => state.model);

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  return (
    <div className="canvas-container">
      <Canvas className="canvas" camera={{ position: [8, 8, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={0.5}
          castShadow
          shadow-mapSize-height={1512}
          shadow-mapSize-width={1512}
        />

        <Suspense fallback={null}>
          <Draggable3DModel
            setIsDragging={setIsDragging}
            selModel={selModel}
            floorPlane={floorPlane}
          />
          <Environment preset="sunset" background />
        </Suspense>
        <Plane />

        <planeHelper args={[floorPlane, 5, 0xddeee]} />
        <primitive object={new THREE.AxesHelper(10)} />
        <OrbitControls minZoom={10} maxZoom={50} enabled={!isDragging} />
      </Canvas>
    </div>
  );
};

export default SceneRenderer;
