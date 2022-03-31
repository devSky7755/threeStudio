import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const ActDeactAccord = (props: any) => {
  const { updateModelControl } = props;
  const [activateAll, setActivateAll] = useState(true);

  useEffect(() => {
    updateModelControl({
      activate_all: activateAll,
    });
  }, [activateAll]);

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="act-deact"
        id="act-deact-header"
      >
        <Typography>Activation/Deactivation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          fullWidth={true}
        >
          <Button key="da" onClick={() => setActivateAll(false)}>
            deactivate all
          </Button>
          <Button key="aa" onClick={() => setActivateAll(true)}>
            activate all
          </Button>
        </ButtonGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActDeactAccord;
