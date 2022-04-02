import { v4 as uuid } from "uuid";
import CatModel from "../components/scene-renderer/models/CatModel";
import SoldierModel from "../components/scene-renderer/models/SoldierModel";

export const JSXModelComponents: any = {
  Soldier: SoldierModel,
  Cat: CatModel,
};

export const GLTF = {
  files: [
    {
      id: uuid(),
      name: "AlphaBlendModeTest.gltf",
    },
    {
      id: uuid(),
      name: "Box.gltf",
    },
    {
      id: uuid(),
      name: "Buggy.gltf",
    },
    {
      id: uuid(),
      name: "Poimandres.gltf",
    },
  ],
};

export const GLB = {
  files: [
    {
      id: uuid(),
      name: "Cat.glb",
      use_jsx: true,
    },
    {
      id: uuid(),
      name: "Soldier.glb",
      use_jsx: true,
    },
  ],
};

export const OBJ = {
  files: [
    {
      id: uuid(),
      name: "Poimandres.obj",
    },
  ],
};
