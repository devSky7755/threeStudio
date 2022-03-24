import { useState } from "react";
import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import "flexlayout-react/style/light.css";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import "./App.css";
import { AssetsPanel } from "./components/assets-panel";
import { EditorPanel } from "./components/editor-panel";
import SceneRenderer from "./components/scene-renderer/SceneRenderer";
import { ADD_MODEL } from "./store/actions";
import { GLTF as MOCK_GLTF } from "./provider/mock";
import { GLB as MOCK_GLB } from "./provider/mock";
import { OBJ as MOCK_OBJ } from "./provider/mock";

const configLayout: IJsonModel = {
  global: {},
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 70,
        children: [
          {
            type: "tab",
            name: "Scene Renderer",
            component: "scene-renderer",
          },
        ],
      },
      {
        type: "row",
        weight: 30,
        children: [
          {
            type: "tabset",
            weight: 50,
            children: [
              {
                type: "tab",
                name: "Assets",
                component: "assets-panel",
              },
            ],
          },
          {
            type: "tabset",
            weight: 50,
            children: [
              {
                type: "tab",
                name: "Editor",
                component: "editor-panel",
              },
            ],
          },
        ],
      },
    ],
  },
};
const model = Model.fromJson(configLayout);

function App() {
  const [event, setEvent] = useState<any>();
  const dispatch = useDispatch();
  const gltfs = MOCK_GLTF.files;
  const glbs = MOCK_GLB.files;
  const objs = MOCK_OBJ.files;

  const factory = (node: TabNode) => {
    switch (node.getComponent()) {
      case "scene-renderer":
        return <SceneRenderer />;
      case "assets-panel":
        return <AssetsPanel />;
      case "editor-panel":
        return <EditorPanel />;
      default:
        break;
    }
  };

  const handleOnMouseUp = (e: any) => {
    setEvent(e);
  };

  const onDragStart = () => {
    document.addEventListener("mouseup", handleOnMouseUp);
  };

  const onDragEnd = (result: any) => {
    if (result.destination?.droppableId === "CANVAS") {
      const selValue = [...gltfs, ...glbs, ...objs].find((file) => {
        return file.id === result.draggableId;
      });
      if (selValue) {
        const ext = selValue?.name.split(".").pop();
        dispatch({
          type: ADD_MODEL,
          payload: {
            file_name: selValue?.name,
            type: ext,
            position: {
              x: event?.offsetX,
              y: event?.offsetY,
            },
          },
        });
      }
    }
    setTimeout(() => {
      document.removeEventListener("mouseup", handleOnMouseUp);
    }, 10);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Layout model={model} factory={factory} />
    </DragDropContext>
  );
}

export default App;
