import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listGroups } from "../logic";
import LoadingScreen from "./LoadingScreen";

export const GroupScreen = (props) => {
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
        console.error(err);
      }
    }
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-3xl font-bold pt-2">Chooose the group to analyze!</p>
        <p className="italic pb-3">
          (for right now, we only sugggest the most recent groupmes.)
        </p>
        <div className="flex flex-col items-start space-y-3">
          {groups.map((group, index) => {
            return (
              <button
                className="text-xl text-blue-400"
                onClick={() =>
                  navigate("/GroupScreen/RankingScreen", {
                    state: {
                      groupObject: group,
                      userApiKey: location.state.apiKey,
                    },
                  })
                }
              >
                {index}. {group.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <LoadingScreen group={true} ranking={false}></LoadingScreen>;
  }
};

export default GroupScreen;
