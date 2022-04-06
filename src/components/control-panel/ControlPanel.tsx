import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import VisibilityAccord from "./VisibilityAccord";
import ActDeactAccord from "./ActDeactAccord";
import PusStpAccord from "./PusStpAccord";
import BlendWeightAccord from "./BlendWeightAccord";
import GeneralSpdAccord from "./GeneralSpdAccord";
import CrossfadingAccord from "./CrossfadingAccord";
import { Model, ModelControl } from "../../store/modelReducer";
import Emitter, { EMIT_CONTROL_EVENT } from "../../service/emitter";

const ControlPanel = (props: any) => {
  const modelRedx = useSelector((state: any) => state.model);
  const [selModel, setSelModel] = useState<Model | null>(null);
  const [control, setControl] = useState<ModelControl>();

  useEffect(() => {
    const sModel = modelRedx.models.find(
      (model: Model) => model.uuid === modelRedx.selModel
    );
    setSelModel(sModel);
  }, [modelRedx.models, modelRedx.selModel]);

  useEffect(() => {
    initControl();
  }, [modelRedx.selModel]);

  const initControl = () => {
    setControl({
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
  };

  const updateModelControl = (updatedControl: ModelControl) => {
    if (!selModel) return;
    setControl({ ...control, ...updatedControl });
  };

  useEffect(() => {
    Emitter.emit(EMIT_CONTROL_EVENT, { control });
  }, [control]);

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
