import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const ActDeactAccord = (props: any) => {
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
          <Button key="da">deactivate all</Button>
          <Button key="aa">activate all</Button>
        </ButtonGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActDeactAccord;
