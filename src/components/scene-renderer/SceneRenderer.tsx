import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Stats } from "@react-three/drei";
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
import {
  Emitter,
  EMIT_CONTROL_EVENT,
  EMIT_KEY_LEFT,
  EMIT_KEY_LEFT_UP,
  EMIT_KEY_RIGHT,
  EMIT_KEY_RIGHT_UP,
  ModelControl,
} from "../../service";
import {
  BodyType,
  Physics,
  PhysicsStats,
  ShapeType,
  useRigidBody,
} from "use-ammojs";

const Ground = () => {
  const [groundRef] = useRigidBody(() => ({
    bodyType: BodyType.STATIC,
    shapeType: ShapeType.BOX,
  }));

  return (
    <Box ref={groundRef} args={[25, 0.1, 25]} receiveShadow>
      <meshPhysicalMaterial attach="material" color="grey" />
    </Box>
  );
};

const PhysicalBox = (props: any) => {
  const { position, ...rest } = props;
  const [ref] = useRigidBody(() => ({
    bodyType: BodyType.DYNAMIC,
    shapeType: ShapeType.BOX,
    position,
  }));

  return (
    <Box ref={ref} castShadow>
      <meshPhysicalMaterial attach="material" color="red" />
    </Box>
  );
};

const SceneRenderer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const modelRedx = useSelector((state: any) => state.model);
  const [controlEvent, setControlEvent] = useState<ModelControl>({
    show_model: true,
    show_skt: false,
    activate_all: true,
    continue_model: true,
    single_step: {
      enabled: false,
      event: false,
      size_of_next: 0.05,
    },
  });
  const dispatch = useDispatch();
  const canvasRef = useRef<any>();

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

  const upHandler = ({ key }: { key: string }) => {
    switch (key) {
      case "ArrowLeft":
        Emitter.emit(EMIT_KEY_LEFT_UP, {});
        break;
      case "ArrowRight":
        Emitter.emit(EMIT_KEY_RIGHT_UP, {});
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    Emitter.on(EMIT_CONTROL_EVENT, (payload) => {
      setControlEvent({
        ...payload?.control,
      });
    });
    document.addEventListener("keydown", downHandler);
    document.addEventListener("keyup", upHandler);
    return () => {
      Emitter.offAll(EMIT_CONTROL_EVENT);
      document.removeEventListener("keydown", downHandler);
      document.removeEventListener("keyup", upHandler);
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
          <Canvas className="canvas" ref={canvasRef}>
            <ambientLight />
            <spotLight intensity={1} position={[5, 20, 20]} />

            <Physics>
              <group dispose={null} onPointerMissed={onPointerMissed}>
                {modelRedx.models.map((model: Model, index: number) => {
                  const isSelected = modelRedx.selModel === model.uuid;
                  return (
                    <Suspense fallback={null} key={index}>
                      <Draggable3DModel
                        key={"model" + index}
                        setIsDragging={setIsDragging}
                        model={model}
                        controlEvent={isSelected ? controlEvent : {}}
                        floorPlane={floorPlane}
                        isSelected={isSelected}
                        onSelectedModel={onSelectedModel}
                        updateModel={updateModel}
                      />
                    </Suspense>
                  );
                })}
              </group>
              <Ground />
              {Array(10)
                .fill(null)
                .map((_, index) => {
                  return (
                    <PhysicalBox key={index} position={[0, index * 2, 0]} />
                  );
                })}
            </Physics>
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
