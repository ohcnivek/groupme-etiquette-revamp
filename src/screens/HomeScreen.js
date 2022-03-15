import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {TextField, Button, Input} from "@mui/material/"
import { useNavigate } from "react-router-dom";


function HomeScreen(props) {
    let navigate = useNavigate();

    const [INPUT_API_KEY, setAPIKey] = useState("");
    const { control, handleSubmit } = useForm({
        defaultValues: {
          userAPIKey: '',

        }
      });
    const onSubmit = (data) => {
        // should probably validate it here
        setAPIKey(data['userAPIKey']);
        navigate('/GroupScreen', {state: {apiKey: data['userAPIKey']}})
    };
    console.log(INPUT_API_KEY);
    
    return (
        <div>
            <h1>who has the worst groupme etiquette amongst ur friends? </h1>
            <h5>to find out, get your groupme api developer token from this link, and submit in the box below! </h5>
            <h5>also no, i dont keep track of tokens that are entered so dont worry :D</h5>


            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                name="userAPIKey"
                control={control}
                render={({ field }) => <Input {...field} />}
                />
                <input type="submit" />
            </form>
        </div>
    
    );
  }


export default HomeScreen;