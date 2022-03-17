import React from "react";
import { CircularProgress } from '@mui/material';

function LoadingScreen(props) {
    return (
        <div>
            <h1> The algorithm is algorithmizing ... (give it a sec)</h1>
            <CircularProgress></CircularProgress>
        </div>
        
    );
  }


export default LoadingScreen;