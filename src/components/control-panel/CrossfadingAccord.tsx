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

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Input = styled(MuiInput)`
  width: 60px;
`;

const CrossfadingAccord = (props: any) => {
  const [duration, setDuration] = useState<
    number | string | Array<number | string>
  >(3.5);

  const handleDurationSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setDuration(newValue);
  };

  const handleDurationInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDuration(event.target.value === "" ? "" : Number(event.target.value));
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
          <Button key="fwti">from walk to idle</Button>
          <Button key="fitw" disabled>
            from idle to work
          </Button>
          <Button key="fwtr">from walk to run</Button>
          <Button key="frtw" disabled>
            from run to work
          </Button>
        </ButtonGroup>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Item>use default duration</Item>
          </Grid>
          <Grid item xs={7}>
            <Checkbox defaultChecked />
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
