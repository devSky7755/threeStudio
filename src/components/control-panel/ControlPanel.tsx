import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import VisibilityAccord from "./VisibilityAccord";
import ActDeactAccord from "./ActDeactAccord";
import PusStpAccord from "./PusStpAccord";
import BlendWeightAccord from "./BlendWeightAccord";
import GeneralSpdAccord from "./GeneralSpdAccord";
import CrossfadingAccord from "./CrossfadingAccord";
import { Model, ModelControl } from "../../store/modelReducer";
import { UPDATE_MODEL } from "../../store/actions";

const ControlPanel = (props: any) => {
  const dispatch = useDispatch();

  const modelRedx = useSelector((state: any) => state.model);
  const [selModel, setSelModel] = useState<Model | null>(null);

  useEffect(() => {
    const sModel = modelRedx.models.find(
      (model: Model) => model.uuid === modelRedx.selModel
    );
    setSelModel(sModel);
  }, [modelRedx.models, modelRedx.selModel]);

  const updateModelControl = (control: ModelControl) => {
    if (!selModel) return;
    const cloneModel = {
      ...selModel,
      control: {
        ...selModel?.control,
        ...control,
      },
    };
    dispatch({
      type: UPDATE_MODEL,
      payload: {
        model: cloneModel,
      },
    });
  };

  return (
    <>
      {selModel && selModel?.animation && (
        <>
          <VisibilityAccord updateModelControl={updateModelControl} />
          <ActDeactAccord updateModelControl={updateModelControl} />
          <PusStpAccord updateModelControl={updateModelControl} />
          <CrossfadingAccord updateModelControl={updateModelControl} />
          <BlendWeightAccord updateModelControl={updateModelControl} />
          <GeneralSpdAccord updateModelControl={updateModelControl} />
        </>
      )}
    </>
  );
};

export default ControlPanel;
