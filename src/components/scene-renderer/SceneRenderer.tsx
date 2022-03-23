import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";

import "./SceneRenderer.css";
import { useSelector } from "react-redux";
import { Droppable } from "react-beautiful-dnd";
import { Model } from "../../store/modelReducer";

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const modelRedx = useSelector((state: any) => state.model);

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  return (
    <Droppable droppableId="CANVAS">
      {(provided, snapshot) => (
        <div
          className="canvas-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Canvas className="canvas" /*camera={{ position: [8, 8, 8] }}*/>
            {/* <Stars /> */}
            <ambientLight />
            <spotLight intensity={1} position={[5, 20, 20]} />

            {modelRedx.models.map((model: Model, index: number) => {
              return (
                <Suspense fallback={null} key={index}>
                  <Draggable3DModel
                    key={"model" + index}
                    setIsDragging={setIsDragging}
                    model={model}
                    color={model.color}
                    floorPlane={floorPlane}
                    isSelected={model.uuid === modelRedx.selModel}
                  />
                  {/* <Environment preset="sunset" background /> */}
                </Suspense>
              );
            })}

            {/* <Plane /> */}
            {/* <planeHelper args={[floorPlane, 5, 0xddeee]} /> */}
            <primitive object={new THREE.AxesHelper(10)} />
            <OrbitControls minZoom={10} maxZoom={50} enabled={!isDragging} />
          </Canvas>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SceneRenderer;
