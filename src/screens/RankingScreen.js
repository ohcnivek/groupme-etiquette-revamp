import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { main } from "../logic";
import LoadingScreen from "./LoadingScreen";

export const RankingScreen = (props) => {
  const location = useLocation();
  let [topANDbottomRanking, settopANDbottomRanking] = useState([[[]], [[]]]);
  let [loading, setLoading] = useState(true);
  const group = location.state.groupObject;

  useEffect(() => {
    async function getRankings() {
      return await main(group, location.state.userApiKey).then((res) => {
        settopANDbottomRanking(res);
        setLoading(false);
      });
    }
    async function fetchRankings() {
      try {
        getRankings();
      } catch (err) {
        console.log("err-");
        console.error(err);
      }
    }
    fetchRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[[]], [[]]]);

  if (!loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-y-4">
          <p className="font-bold text-3xl">The Verdict.</p>
          <p className="italic text-sm"> for those who sent messages :)</p>
          <div>
            <p className="text-xl font-semibold">🎉 Winners: top 15% 🎊🍾</p>
            <div>
              {topANDbottomRanking[0].map((pair, index) => {
                return (
                  <div className="flex flex-row">
                    <p className="font-bold pr-2">{index + 1}. </p>
                    <p>
                      {pair[1]} : ratio of {Math.round(pair[0] * 100) / 100}{" "}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold">
              😪 Not Winners: bottom 15% 🫤
            </p>
            <div>
              {topANDbottomRanking[1].map((pair, index) => {
                return (
                  <div className="flex flex-row">
                    <p className="font-bold pr-2">{index + 1}. </p>
                    <p>
                      {pair[1]} : ratio of {Math.round(pair[0] * 100) / 100}{" "}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <LoadingScreen group={false} ranking={true}></LoadingScreen>
      </div>
    );
  }
};

export default RankingScreen;
