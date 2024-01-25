import React from "react";
import { Box } from "@mui/material";

export const CustomDragPreview = (props) => {
  const item = props.monitorProps.item;

  return (
    <Box>
      <Box>{item.text}</Box>
    </Box>
  );
};
