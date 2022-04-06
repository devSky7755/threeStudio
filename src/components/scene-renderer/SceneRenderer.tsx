import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";

import "./SceneRenderer.css";

import Draggable3DModel from "./Draggable3DModel";
// import Plane from "./Plane";
import { Droppable } from "react-beautiful-dnd";
import { Model } from "../../store/modelReducer";
import {
  DESELECT_MODEL,
  SELECT_MODEL,
  UPDATE_MODEL,
} from "../../store/actions";
import Emitter, { EMIT_KEY_LEFT, EMIT_KEY_RIGHT } from "../../service/emitter";

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const modelRedx = useSelector((state: any) => state.model);
  const dispatch = useDispatch();

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  const onSelectedModel = (uuid: string) => {
    dispatch({
      type: SELECT_MODEL,
      payload: {
        selected: uuid,
      },
    });
  };

  const onPointerMissed = (event: any) => {
    dispatch({
      type: DESELECT_MODEL,
    });
  };

  const updateModel = (model: Model) => {
    dispatch({
      type: UPDATE_MODEL,
      payload: {
        model,
      },
    });
  };

  const downHandler = ({ key }: { key: string }) => {
    switch (key) {
      case "ArrowLeft":
        Emitter.emit(EMIT_KEY_LEFT, {});
        break;
      case "ArrowRight":
        Emitter.emit(EMIT_KEY_RIGHT, {});
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", downHandler);
    return () => {
      document.removeEventListener("keydown", downHandler);
    };
  });

  return (
    <Droppable droppableId="CANVAS">
      {(provided) => (
        <div
          className="canvas-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Canvas className="canvas">
            <ambientLight />
            <spotLight intensity={1} position={[5, 20, 20]} />

            <group dispose={null} onPointerMissed={onPointerMissed}>
              {modelRedx.models.map((model: Model, index: number) => {
                const isSelected = modelRedx.selModel === model.uuid;
                return (
                  <Suspense fallback={null} key={index}>
                    <Draggable3DModel
                      key={"model" + index}
                      setIsDragging={setIsDragging}
                      model={model}
                      color={model.color}
                      floorPlane={floorPlane}
                      isSelected={isSelected}
                      onSelectedModel={onSelectedModel}
                      updateModel={updateModel}
                    />
                  </Suspense>
                );
              })}
            </group>
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
