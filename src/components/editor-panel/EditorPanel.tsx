import React, { Fragment, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import Popover from "@mui/material/Popover";
import { HexColorPicker } from "react-colorful";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import "./EditorPanel.css";
import { SET_MODEL_COLOR } from "../../store/actions";
import { Model } from "../../store/modelReducer";

const EditorPanel = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const modelRedx = useSelector((state: any) => state.model);
  const [selModel, setSelModel] = useState<Model | null>(null);
  const [color, setColor] = useState("#ffffff");
  const dispatch = useDispatch();

  const dispatchColor = (color: string) => {
    dispatch({
      type: SET_MODEL_COLOR,
      payload: {
        color,
      },
    });
  };

  const debounceDispatchColor = useCallback(debounce(dispatchColor, 300), []);

  useEffect(() => {
    const sModel = modelRedx.models.find(
      (model: Model) => model.uuid === modelRedx.selModel
    );
    setSelModel(sModel);
    if (sModel) {
      setColor(sModel.color);
    }
  }, [modelRedx.selModel]);

  useEffect(() => {
    debounceDispatchColor(color);
  }, [color]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const openPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-picker-popper" : undefined;
  return (
    <Box component="div" sx={{ display: "flex", flexWrap: "wrap" }}>
      {selModel && (
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-color">
            {selModel?.uuid} Color
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-color"
            value={color}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="open color picker"
                  onClick={openPicker}
                  aria-describedby={id}
                  edge="end"
                >
                  <ColorLensIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="popover_class"
      >
        <HexColorPicker color={color} onChange={(value) => setColor(value)} />
      </Popover>
    </Box>
  );
};

export default EditorPanel;
