import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLTF as MOCK_GLTF } from "../../provider/mock";
import { OBJ as MOCK_OBJ } from "../../provider/mock";

import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

import { SET_MODEL } from "../../store/actions";

const AssetsPanel = () => {
  const dispatch = useDispatch();
  const selModel = useSelector((state: any) => state.model);
  const [value, setValue] = useState(selModel.file_name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    setValue(newValue);

    const ext = newValue.split(".").pop();
    dispatch({
      type: SET_MODEL,
      payload: {
        file_name: newValue,
        type: ext,
      },
    });
  };

  const gltfNames = MOCK_GLTF.file_names;
  const objNames = MOCK_OBJ.file_names;

  return (
    <Box component="div" sx={{ p: 2 }}>
      <FormControl className={"p-1"} margin="normal" fullWidth>
        <FormLabel id="assets-radio-group-label">Select Assets</FormLabel>
        <RadioGroup
          aria-labelledby="assets-radio-group-label"
          name="radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          {gltfNames.map((name, i) => (
            <FormControlLabel
              value={name}
              control={<Radio />}
              label={name}
              key={i}
            />
          ))}
          {objNames.map((name, i) => (
            <FormControlLabel
              value={name}
              control={<Radio />}
              label={name}
              key={i}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default AssetsPanel;
