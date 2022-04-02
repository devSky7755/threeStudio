import React, { useState, ChangeEvent, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Emitter, {
  EMIT_WEIGHT_CHANGED,
  EMIT_WEIGHT_CHANGED_BY_CONTROL,
} from "../../service/emitter";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Input = styled(MuiInput)`
  width: 60px;
`;

const BlendWeightAccord = (props: any) => {
  const controlRedx = useSelector((state: any) => state.control);
  const [isEffective, setIsEffective] = useState(false);

  useEffect(() => {
    if (!controlRedx?.action) {
      return;
    }
    setIsEffective(true);
    setTimeout(() => {
      setIsEffective(false);
    }, (controlRedx.duration + 0.9) * 1000);
  }, [controlRedx]);

  const setWeights = (weights: any) => {
    setIdle(weights?.idle || 0);
    setWalk(weights?.walk || 0);
    setRun(weights?.run || 0);
  };

  useEffect(() => {
    if (isEffective) {
      Emitter.on(EMIT_WEIGHT_CHANGED, setWeights);
    } else {
      Emitter.offAll(EMIT_WEIGHT_CHANGED);
    }
  }, [isEffective]);

  const [idle, setIdle] = useState<number | string | Array<number | string>>(0);
  const [walk, setWalk] = useState<number | string | Array<number | string>>(1);
  const [run, setRun] = useState<number | string | Array<number | string>>(0);

  const handleIdleSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    updateIdle(newValue);
  };

  const handleIdleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    updateIdle(newValue);
  };

  const handleIdleBlur = () => {
    if (idle < 0) {
      updateIdle(0);
    } else if (idle > 1) {
      updateIdle(1);
    }
  };

  const updateIdle = (newValue: any) => {
    setIdle(newValue);
    Emitter.emit(EMIT_WEIGHT_CHANGED_BY_CONTROL, {
      idle: newValue,
      walk,
      run,
    });
  };

  const handleWalkSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    updateWalk(newValue);
  };

  const handleWalkInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    updateWalk(newValue);
  };

  const handleWalkBlur = () => {
    if (walk < 0) {
      updateWalk(0);
    } else if (walk > 1) {
      updateWalk(1);
    }
  };

  const updateWalk = (newValue: any) => {
    setWalk(newValue);
    Emitter.emit(EMIT_WEIGHT_CHANGED_BY_CONTROL, {
      idle,
      walk: newValue,
      run,
    });
  };

  const handleRunSliderChange = (event: Event, newValue: number | number[]) => {
    updateRun(newValue);
  };

  const handleRunInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    updateRun(newValue);
  };

  const handleRunBlur = () => {
    if (run < 0) {
      updateRun(0);
    } else if (run > 1) {
      updateRun(1);
    }
  };

  const updateRun = (newValue: any) => {
    setRun(newValue);
    Emitter.emit(EMIT_WEIGHT_CHANGED_BY_CONTROL, {
      idle,
      walk,
      run: newValue,
    });
  };

  return (
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="blend-weights"
        id="blend-weights-header"
      >
        <Typography>Blend Weights</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} sx={{ mt: -1.45 }}>
          <Grid item xs={5}>
            <Item>modify idle weight</Item>
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
                  value={typeof idle === "number" ? idle : 0}
                  min={0}
                  max={1}
                  defaultValue={0}
                  step={0.01}
                  onChange={handleIdleSliderChange}
                  aria-labelledby="input-idle-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={idle}
                  size="small"
                  onChange={handleIdleInputChange}
                  onBlur={handleIdleBlur}
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    max: 1,
                    type: "number",
                    "aria-labelledby": "input-idle-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: -1.45 }}>
          <Grid item xs={5}>
            <Item>modify walk weight</Item>
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: -1, pt: 0 }}
            >
              <Grid item xs>
                <Slider
                  value={typeof walk === "number" ? walk : 0}
                  min={0}
                  max={1}
                  defaultValue={1}
                  step={0.01}
                  onChange={handleWalkSliderChange}
                  aria-labelledby="input-walk-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={walk}
                  size="small"
                  onChange={handleWalkInputChange}
                  onBlur={handleWalkBlur}
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    max: 1,
                    type: "number",
                    "aria-labelledby": "input-walk-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: -1.45 }}>
          <Grid item xs={5}>
            <Item>modify run weight</Item>
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: -1, pt: 0 }}
            >
              <Grid item xs>
                <Slider
                  value={typeof run === "number" ? run : 0}
                  min={0}
                  max={1}
                  defaultValue={0}
                  step={0.01}
                  onChange={handleRunSliderChange}
                  aria-labelledby="input-run-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={run}
                  size="small"
                  onChange={handleRunInputChange}
                  onBlur={handleRunBlur}
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    max: 1,
                    type: "number",
                    "aria-labelledby": "input-run-slider",
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

export default BlendWeightAccord;
