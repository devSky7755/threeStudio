import React, { useState, ChangeEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { IDLE_ACTION, RUN_ACTION, WALK_ACTION } from "../../service/emit-actions";
import { Emitter, COMMIT_CONTROL_ACTION } from "../../service";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Input = styled(MuiInput)`
  width: 60px;
`;

const CrossfadingAccord = (props: any) => {
  const { updateModelControl } = props;

  const [defaultDur, setDefaultDur] = useState(true);
  const [duration, setDuration] = useState<number>(3.5);
  const [disabled, setDisabled] = useState({
    walkToIdle: true,
    idleToWalk: false,
    walkToRun: true,
    runToWalk: true,
  });

  const walkToIdle = () => {
    setDisabled({
      walkToIdle: true,
      idleToWalk: false,
      walkToRun: true,
      runToWalk: true,
    });
    prepareCrossFade(WALK_ACTION, IDLE_ACTION, 1.0);
  };
  const idleToWalk = () => {
    setDisabled({
      walkToIdle: false,
      idleToWalk: true,
      walkToRun: false,
      runToWalk: true,
    });
    prepareCrossFade(IDLE_ACTION, WALK_ACTION, 0.5);
  };
  const walkToRun = () => {
    setDisabled({
      walkToIdle: true,
      idleToWalk: true,
      walkToRun: true,
      runToWalk: false,
    });
    prepareCrossFade(WALK_ACTION, RUN_ACTION, 2.5);
  };
  const runToWalk = () => {
    setDisabled({
      walkToIdle: false,
      idleToWalk: true,
      walkToRun: false,
      runToWalk: true,
    });
    prepareCrossFade(RUN_ACTION, WALK_ACTION, 5.0);
  };

  const prepareCrossFade = (
    startAction: string,
    endAction: string,
    defaultDur = 1.0
  ) => {
    const dur: number = defaultDur ? defaultDur : duration;
    disableStepMode();
    updateControlAction(startAction, endAction, dur);
  };

  const updateControlAction = (
    startAction: string,
    endAction: string,
    dur: number
  ) => {
    Emitter.emit(COMMIT_CONTROL_ACTION, {
      action: {
        start: startAction,
        end: endAction,
      },
      duration: dur,
    });
  };

  const disableStepMode = () => {
    updateModelControl({
      continue_model: true,
      single_step: {
        enabled: false,
      },
    });
  };

  const handleDefaultDurChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDefaultDur(event.target.checked);
  };

  const handleDurationSliderChange = (event: Event, newValue: any) => {
    setDuration(newValue);
  };

  const handleDurationInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDuration(event.target.value === "" ? 10 : Number(event.target.value));
  };

  const handleDurationBlur = () => {
    if (duration < 0) {
      setDuration(0);
    } else if (duration > 10) {
      setDuration(10);
    }
  };

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="crossfading"
        id="crossfading-header"
      >
        <Typography>Crossfading</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          fullWidth={true}
        >
          <Button
            key="fwti"
            disabled={disabled?.walkToIdle}
            onClick={walkToIdle}
          >
            from walk to idle
          </Button>
          <Button
            key="fitw"
            disabled={disabled?.idleToWalk}
            onClick={idleToWalk}
          >
            from idle to walk
          </Button>
          <Button key="fwtr" disabled={disabled?.walkToRun} onClick={walkToRun}>
            from walk to run
          </Button>
          <Button key="frtw" disabled={disabled?.runToWalk} onClick={runToWalk}>
            from run to walk
          </Button>
        </ButtonGroup>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Item>use default duration</Item>
          </Grid>
          <Grid item xs={7}>
            <Checkbox checked={defaultDur} onChange={handleDefaultDurChange} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: -1.45 }}>
          <Grid item xs={5}>
            <Item>set custom duration</Item>
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
                  value={typeof duration === "number" ? duration : 0}
                  min={0}
                  max={10}
                  defaultValue={3.5}
                  step={0.1}
                  onChange={handleDurationSliderChange}
                  aria-labelledby="input-dur-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={duration}
                  size="small"
                  onChange={handleDurationInputChange}
                  onBlur={handleDurationBlur}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 10,
                    type: "number",
                    "aria-labelledby": "input-dur-slider",
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

export default CrossfadingAccord;
