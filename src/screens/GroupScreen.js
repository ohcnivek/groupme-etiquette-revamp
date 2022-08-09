import React, { useState, useEffect } from "react";
import { Button } from "@mui/material/";
import { useNavigate, useLocation } from "react-router-dom";
import { listGroups } from "../logic";
import LoadingScreen from "./LoadingScreen";

function GroupScreen(props) {
  let navigate = useNavigate();
  const location = useLocation();

  let [groups, setGroups] = useState([]);
  let [loading, setLoading] = useState(true);
  const INPUT_API_KEY = location.state.apiKey;

  useEffect(() => {
    async function getGroups() {
      return await listGroups(INPUT_API_KEY).then((res) => {
        setGroups(res);
        setLoading(false);
      });
    }

    async function fetchGroups() {
      try {
        getGroups();
      } catch (err) {
        console.log("err-");
        console.error(err);
      }
    }

    fetchGroups();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(groups);

  if (!loading) {
    return (
      <div>
        <h1> Chooose the group to analyze! </h1>
        <h5> (for right now the more the messages in the gc, the better) </h5>

        {groups.map((group, index) => {
          return (
            <Button
              onClick={() =>
                navigate("/GroupScreen/RankingScreen", {
                  state: {
                    groupObject: group,
                    userApiKey: location.state.apiKey,
                  },
                })
              }
            >
              {" "}
              {index}. {group.name}{" "}
            </Button>
          );
        })}
      </div>
    );
  } else {
    return <LoadingScreen group={true} ranking={false}></LoadingScreen>;
  }
}

export default GroupScreen;
