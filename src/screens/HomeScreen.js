import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@mui/material/";
import { useNavigate } from "react-router-dom";

export const HomeScreen = () => {
  let navigate = useNavigate();
  const [INPUT_API_KEY, setAPIKey] = useState("");
  const { control, handleSubmit } = useForm({
    defaultValues: {
      userAPIKey: "",
    },
  });
  const onSubmit = (data) => {
    // @todo, validate here
    setAPIKey(data["userAPIKey"]);
    navigate("/GroupScreen", { state: { apiKey: data["userAPIKey"] } });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl pt-4">
        Who has the worst Groupme etiquette?
      </h1>
      <p className="font-semibold text-xl">Follow these simple steps: </p>
      <div className="max-w-sm space-y-2 text-xl">
        <p>
          1. Login with your GroupMe credentials at this{" "}
          <a
            className="text-blue-500"
            href="https://dev.groupme.com/session/new"
          >
            link
          </a>{" "}
        </p>
        <p>
          2. After verifying your identity etc, click the button labeled "Access
          Token" on the top right corner next to your name.
        </p>
        <p>3. Copy that access token, and paste it into the box below! </p>
      </div>
      <div className="pb-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="userAPIKey"
            control={control}
            defaultValue={"paste token here"}
            render={({ field }) => <Input {...field} />}
          />
          <input type="submit" />
        </form>
      </div>
      <div className="italic">
        <p>built with love, react + vercel, </p>
        <p className="font-bold">kevin c. </p>
      </div>
      <p className="text-red-400" href="/">
        Disclaimer: I don't see or save your access tokens in any way shape or
        form
      </p>
    </div>
  );
};

export default HomeScreen;
