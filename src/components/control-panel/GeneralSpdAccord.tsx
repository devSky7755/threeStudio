import React, { useState, ChangeEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Emitter, EMIT_TIME_SCALE_CHANGED_BY_CONTROL } from "../../service";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Input = styled(MuiInput)`
  width: 60px;
`;

const GeneralSpdAccord = (props: any) => {
  const [time, setTime] = useState<number | string | Array<number | string>>(1);

  const handleTimeSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    updateTimeScale(newValue);
  };

  const handleTimeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    updateTimeScale(newValue);
  };

  const handleTimeBlur = () => {
    if (time < 0) {
      updateTimeScale(0);
    } else if (time > 1.5) {
      updateTimeScale(1.5);
    }
  };

  const updateTimeScale = (newValue: any) => {
    setTime(newValue);
    Emitter.emit(EMIT_TIME_SCALE_CHANGED_BY_CONTROL, {
      timeScale: newValue,
    });
  };

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="general-speed"
        id="general-speed-header"
      >
        <Typography>General Speed</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} sx={{ mt: -1.45 }}>
          <Grid item xs={5}>
            <Item>modify time scale</Item>
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
                  value={typeof time === "number" ? time : 0}
                  min={0}
                  max={1.5}
                  defaultValue={1}
                  step={0.01}
                  onChange={handleTimeSliderChange}
                  aria-labelledby="input-time-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={time}
                  size="small"
                  onChange={handleTimeInputChange}
                  onBlur={handleTimeBlur}
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    max: 1.5,
                    type: "number",
                    "aria-labelledby": "input-time-slider",
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

export default GeneralSpdAccord;
