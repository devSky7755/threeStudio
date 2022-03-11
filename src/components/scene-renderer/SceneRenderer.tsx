import { Canvas } from "@react-three/fiber";
import Draggable3DModel from "./Draggable3DModel";
import Plane from "./Plane";
import "./SceneRenderer.css";

const SceneRenderer = () => {
  return (
    <div className="canvas-container">
      <Canvas className="canvas" camera={{ position: [8, 8, 8] }}>
        <pointLight position={[8, 8, 8]} args={["white", 1, 100]} />
        <fog attach="fog" args={["grey", 2, 8]} />
        <Draggable3DModel />
        <Plane />
        <gridHelper args={[20, 20, 0x888888]} />
        <gridHelper args={[20, 4, 0x222222]} />
      </Canvas>
      ,
    </div>
  );
};

export default SceneRenderer;
