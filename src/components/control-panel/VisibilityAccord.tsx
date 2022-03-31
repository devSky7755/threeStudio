import React, { ChangeEvent, useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const VisibilityAccord = (props: any) => {
  const { updateModelControl } = props;
  const [showModel, setShowModel] = useState(true);
  const [showSkt, setShowSkt] = useState(false);

  const handleShowModelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowModel(event.target.checked);
  };

  const handleShowSktChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowSkt(event.target.checked);
  };

  useEffect(() => {
    updateModelControl({
      show_model: showModel,
      show_skt: showSkt,
    });
  }, [showModel, showSkt]);

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="visibility"
        id="visibility-header"
      >
        <Typography>Visibility</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Item>show model</Item>
          </Grid>
          <Grid item xs={7}>
            <Checkbox
              checked={showModel}
              onChange={handleShowModelChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Grid>
          <Grid item xs={5}>
            <Item>show skeleton</Item>
          </Grid>
          <Grid item xs={7}>
            <Checkbox
              checked={showSkt}
              onChange={handleShowSktChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default VisibilityAccord;
