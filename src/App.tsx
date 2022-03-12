import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import "./App.css";
import "flexlayout-react/style/light.css";
import SceneRenderer from "./components/scene-renderer/SceneRenderer";
import { AssetsPanel } from "./components/assets-panel";

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
        type: "tabset",
        weight: 30,
        children: [
          {
            type: "tab",
            name: "Assets",
            component: "assets-panel",
          },
        ],
      },
    ],
  },
};
const model = Model.fromJson(configLayout);

function App() {
  const factory = (node: TabNode) => {
    switch (node.getComponent()) {
      case "scene-renderer":
        return <SceneRenderer />;
      case "assets-panel":
        return <AssetsPanel />;
      default:
        break;
    }
  };

  return <Layout model={model} factory={factory} />;
}

export default App;
