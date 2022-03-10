import React, { FunctionComponent, useEffect, useState } from "react";
import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import "./App.css";
import "flexlayout-react/style/light.css";

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
            component: "button",
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
    var component = node.getComponent();
    if (component === "button") {
      return <button>{node.getName()}</button>;
    }
  };

  return <Layout model={model} factory={factory} />;
}

export default App;
