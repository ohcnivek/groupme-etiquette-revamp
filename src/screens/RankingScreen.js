import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import {main} from "../logic"
import LoadingScreen from "./LoadingScreen";

function RankingScreen(props) {
    const location = useLocation();
    let [topANDbottomRanking, settopANDbottomRanking] = useState([[[]], [[]]]);
    let [loading, setLoading] = useState(true);
    const group = location.state.groupObject

    useEffect(()=> {
        async function getRankings() {
            return await main(group, location.state.userApiKey).then(
                res => {
                    settopANDbottomRanking(res)
                    setLoading(false)
                }
            )
        }

        async function fetchRankings() {
            try {
                getRankings();
            } catch (err) {
              console.log('err-');
              console.error(err);
            }
        }

        fetchRankings()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [[[]], [[]]])

    if (!loading) {
        return (
            <div>
                    <h1>Rankings (based on messages sent to likes recieved) </h1>
    
                    <h2>winners: top 15% of those who sent messages </h2>
                    {topANDbottomRanking[0].map((pair, index) => { 
                                    return <h3> {index + 1}. {pair[1]} : ratio of {Math.round(pair[0] * 100) / 100} </h3>
                                })
                                }
    
                    <h2>not winners: bottom 15% of those who sent messages</h2>
                    {topANDbottomRanking[1].map((pair, index) => { 
                                    return <h3> {index + 1}. {pair[1]} : ratio of {Math.round(pair[0] * 100) / 100} </h3>
                                })
                                }
                            
            </div>
        );
    } else {
        return (
            <div>
                <LoadingScreen></LoadingScreen>
            </div>
        );
    }

   
    
  }


export default RankingScreen;