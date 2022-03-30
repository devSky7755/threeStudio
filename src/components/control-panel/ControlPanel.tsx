import React from "react";

import VisibilityAccord from "./VisibilityAccord";
import ActDeactAccord from "./ActDeactAccord";
import PusStpAccord from "./PusStpAccord";
import BlendWeightAccord from "./BlendWeightAccord";
import GeneralSpdAccord from "./GeneralSpdAccord";
import CrossfadingAccord from "./CrossfadingAccord";

const ControlPanel = (props: any) => {
  return (
    <>
      <VisibilityAccord />
      <ActDeactAccord />
      <PusStpAccord />
      <CrossfadingAccord />
      <BlendWeightAccord />
      <GeneralSpdAccord />
    </>
  );
};

export default ControlPanel;
