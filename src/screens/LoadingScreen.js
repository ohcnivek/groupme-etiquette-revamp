import React from "react";
import { CircularProgress } from "@mui/material";

export const LoadingScreen = (props) => {
  const groupText = "Fetching your most recent groups!";
  const rankingScreenText = "The algorithm is algorithmizing ... beep boop";
  let renderText = "";
  if (props.group) {
    renderText = groupText;
  } else {
    renderText = rankingScreenText;
  }
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <p className="font-bold"> {renderText} </p>
      <CircularProgress></CircularProgress>
    </div>
  );
};

export default LoadingScreen;
