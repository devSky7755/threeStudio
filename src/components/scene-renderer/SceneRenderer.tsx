import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";

import "./SceneRenderer.css";
import { useSelector } from "react-redux";
import { Droppable } from "react-beautiful-dnd";

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [models, setModels] = useState<Array<any>>([]);
  const addedModel = useSelector((state: any) => state.model);

  useEffect(() => {
    if (addedModel.position && addedModel.file_name) {
      setModels((oldModels) => [...oldModels, addedModel]);
    }
  }, [addedModel]);

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  return (
    <Droppable droppableId="CANVAS">
      {(provided, snapshot) => (
        <div
          className="canvas-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Canvas className="canvas" camera={{ position: [8, 8, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight
              intensity={0.5}
              castShadow
              shadow-mapSize-height={1512}
              shadow-mapSize-width={1512}
            />

            {models.map((model, index) => {
              return (
                <Suspense fallback={null} key={index}>
                  <Draggable3DModel
                    key={"drag" + index}
                    index={"drag" + index}
                    setIsDragging={setIsDragging}
                    model={model}
                    floorPlane={floorPlane}
                  />
                  <Environment
                    key={"envior" + index}
                    preset="sunset"
                    background
                  />
                </Suspense>
              );
            })}

            <Plane />

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
