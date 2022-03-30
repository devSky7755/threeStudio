import React, { useState, ChangeEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Input = styled(MuiInput)`
  width: 60px;
`;

const PusStpAccord = (props: any) => {
  const [stepSize, setStepSize] = useState<
    number | string | Array<number | string>
  >(0.05);

  const handleStepSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setStepSize(newValue);
  };

  const handleStepInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStepSize(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleStepBlur = () => {
    if (stepSize < 0) {
      setStepSize(0);
    } else if (stepSize > 0.1) {
      setStepSize(0.1);
    }
  };

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="pus-stp"
        id="pus-stp-header"
      >
        <Typography>Pausing/Stepping</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          fullWidth={true}
        >
          <Button key="pc">pause/continue</Button>
          <Button key="mss">make single step</Button>
        </ButtonGroup>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Item>modify step size</Item>
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: -1.45, pt: 0 }}
            >
              <Grid item xs>
                <Slider
                  value={typeof stepSize === "number" ? stepSize : 0}
                  min={0}
                  max={0.1}
                  defaultValue={0.05}
                  step={0.001}
                  onChange={handleStepSliderChange}
                  aria-labelledby="input-step-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={stepSize}
                  size="small"
                  onChange={handleStepInputChange}
                  onBlur={handleStepBlur}
                  inputProps={{
                    step: 0.001,
                    min: 0,
                    max: 0.1,
                    type: "number",
                    "aria-labelledby": "input-step-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PusStpAccord;
