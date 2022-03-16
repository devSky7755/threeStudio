import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
// import { EffectComposer, Outline } from "@react-three/postprocessing";

import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";

import "./SceneRenderer.css";
import { useSelector } from "react-redux";
import { Droppable } from "react-beautiful-dnd";

// const { BlendFunction, Resizer, KernelSize } = require("postprocessing");

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [models, setModels] = useState<Array<any>>([]);
  // const [selectedObject, setSelectedObject] = useState(null);
  const addedModel = useSelector((state: any) => state.model);

  useEffect(() => {
    if (addedModel.position && addedModel.file_name) {
      setModels((oldModels) => [...oldModels, addedModel]);
    }
  }, [addedModel]);

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  // const selected = selectedObject ? [selectedObject] : undefined;
  // console.log(selected);
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
            {/* <directionalLight
              intensity={0.5}
              castShadow
              shadow-mapSize-height={1512}
              shadow-mapSize-width={1512}
            /> */}
            {/* <spotLight position={[8, 8, 8]} angle={0.15} penumbra={1} />
            <pointLight position={[-8, -8, -8]} /> */}

            {models.map((model, index) => {
              return (
                <Suspense fallback={null} key={index}>
                  <Draggable3DModel
                    // index={index}
                    setIsDragging={setIsDragging}
                    model={model}
                    floorPlane={floorPlane}
                    // selectedObject={selectedObject}
                    // setSelectedObject={setSelectedObject}
                  />
                  {/* <Environment preset="sunset" background /> */}
                </Suspense>
              );
            })}

            <Plane />
            {/* {selected && (
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                  blur
                  selection={selected}
                  visibleEdgeColor={0xff0000}
                  edgeStrength={100}
                  width={500}
                />
              </EffectComposer>
            )} */}
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
