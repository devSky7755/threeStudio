import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export const loader = (selModel: any): any => {
  switch (selModel.type) {
    case "gltf":
      return GLTFLoader;
    case "obj":
      return OBJLoader;
    case "fbx":
      return FBXLoader;
    default:
      return GLTFLoader;
  }
};

export const getObj = (selModel: any, loadedModel: any) => {
  switch (selModel.type) {
    case "gltf":
      return loadedModel.scene;
    case "obj":
    case "fbx":
      return loadedModel;
    default:
      return loadedModel;
  }
};
