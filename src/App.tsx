import React, { FunctionComponent, useEffect, useState } from "react";
import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import "./App.css";
import "flexlayout-react/style/light.css";
import SceneRenderer from "./components/scene-renderer/SceneRenderer";

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
            name: "Two",
            component: "button",
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
      case "button":
        return <button>{node.getName()}</button>;
      default:
        break;
    }
  };

  return <Layout model={model} factory={factory} />;
}

export default App;
