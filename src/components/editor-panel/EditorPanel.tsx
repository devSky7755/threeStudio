import React, { Fragment, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { HexColorPicker } from "react-colorful";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import "./EditorPanel.css";
import { DELETE_SEL_MODEL, SET_MODEL_COLOR } from "../../store/actions";
import { Model } from "../../store/modelReducer";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const EditorPanel = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const modelRedx = useSelector((state: any) => state.model);
  const [selModel, setSelModel] = useState<Model | null>(null);
  const [color, setColor] = useState("#ffffff");
  const dispatch = useDispatch();

  const debounceDispatchColor = useCallback(
    debounce((color: string | null) => {
      dispatch({
        type: SET_MODEL_COLOR,
        payload: {
          color,
        },
      });
    }, 300),
    []
  );

  useEffect(() => {
    if (!modelRedx || !modelRedx.models) return;
    const sModel = modelRedx.models.find(
      (model: Model) => model.uuid === modelRedx.selModel
    );
    setSelModel(sModel);
    if (sModel) {
      setColor(sModel.color);
    }
  }, [modelRedx.models, modelRedx.selModel]);

  useEffect(() => {
    debounceDispatchColor(color);
  }, [debounceDispatchColor, color]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const openPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const originIcon = (event: React.MouseEvent<HTMLElement>) => {
    debounceDispatchColor(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteSelModel = (event: React.MouseEvent<HTMLElement>) => {
    dispatch({
      type: DELETE_SEL_MODEL,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-picker-popper" : undefined;
  return (
    <Box
      component="div"
      sx={{ display: "flex", flexWrap: "wrap", p: 1, flexDirection: "column" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Item>Type</Item>
        </Grid>
        <Grid item xs={9}>
          <Item>{selModel?.type}</Item>
        </Grid>
        <Grid item xs={3}>
          <Item>Name</Item>
        </Grid>
        <Grid item xs={9}>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Item>{selModel?.file_name}</Item>
            {selModel && (
              <IconButton aria-label="remove object" onClick={deleteSelModel}>
                <DeleteOutlineIcon color="error" />
              </IconButton>
            )}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Item>UUID</Item>
        </Grid>
        <Grid item xs={9}>
          <Item>{selModel?.uuid}</Item>
        </Grid>
        {selModel && (
          <>
            <Grid item xs={3}>
              <Item>Color</Item>
            </Grid>
            <Grid item xs={9}>
              <Input
                id="adornment-color"
                value={color || ""}
                onChange={handleChange}
                fullWidth
                sx={{ px: 1 }}
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
                    <IconButton
                      aria-label="open color picker"
                      onClick={originIcon}
                      aria-describedby={id}
                      edge="end"
                    >
                      <SettingsBackupRestoreIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
          </>
        )}
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="popover_class"
      >
        <HexColorPicker
          color={color || "#ffffff"}
          onChange={(value) => setColor(value)}
        />
      </Popover>
    </Box>
  );
};

export default EditorPanel;
