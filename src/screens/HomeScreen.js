import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@mui/material/";
import { useNavigate } from "react-router-dom";

function HomeScreen(props) {
  let navigate = useNavigate();

  const [INPUT_API_KEY, setAPIKey] = useState("");
  const { control, handleSubmit } = useForm({
    defaultValues: {
      userAPIKey: "",
    },
  });
  const onSubmit = (data) => {
    // should probably validate it here
    setAPIKey(data["userAPIKey"]);
    navigate("/GroupScreen", { state: { apiKey: data["userAPIKey"] } });
  };

  return (
    <div>
      <header className="App-title">
        <h1>who has the worst groupme etiquette? </h1>
      </header>

      <header className="App-header">
        <h6>
          {" "}
          Disclaimer: I cannot see or save your access tokens in any way shape
          or form (at least to my knowledge){" "}
        </h6>
      </header>

      <h5>Follow these simple steps: </h5>

      <header className="App-mid">
        <h5>
          1. Login with your GroupMe credentials at this{" "}
          <a href="https://dev.groupme.com/session/new">link</a>{" "}
        </h5>
        <h5>
          2. After verifying your identity etc, click the button labeled "Access
          Token" on the top right corner next to your name
        </h5>
        <h5>3. Copy that access token, and paste it into the box below! </h5>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="userAPIKey"
          control={control}
          defaultValue={"paste token here"}
          render={({ field }) => <Input {...field} />}
        />
        <input type="submit" />
      </form>

      <h5>built with love, react + vercel, </h5>
      <h5> - kevin c. </h5>
    </div>
  );
}

export default HomeScreen;
