import React from "react";
import { CircularProgress } from '@mui/material';

function LoadingScreen(props) {

    const groupText = "Fetching your most recent groups!"
    const rankingScreenText = "The algorithm is algorithmizing ... (give it a sec)"
    let renderText = "";

    if (props.group) {
        renderText = groupText;
    } else {
        renderText = rankingScreenText;
    }

    return (
        <div>
            <h1> {renderText} </h1>
            <CircularProgress></CircularProgress>
        </div>
        
    );
  }


export default LoadingScreen;