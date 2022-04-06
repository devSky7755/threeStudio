import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";

import { loader, getObj } from "../../../service/scene-renderer";
import { JSXModelComponents } from "../../../provider/mock";

const RenderModel = (props: any) => {
  const { model, setAnimationExist, ...rest } = props;
  const obj = getObj(
    model,
    useLoader(loader(model), "/assets/" + model.type + "/" + model.file_name)
  );

  useEffect(() => {
    setAnimationExist(model.use_jsx);
  }, [model.use_jsx, setAnimationExist]);

  const CustomTag =
    JSXModelComponents[model?.file_name?.replace(/\.[^/.]+$/, "") || "Soldier"];

  return (
    <>
      {!model.use_jsx && <primitive {...rest} object={obj} scale={0.1} />}
      {model.use_jsx && (
        <CustomTag {...rest} setAnimationExist={setAnimationExist}></CustomTag>
      )}
    </>
  );
};

export default RenderModel;
