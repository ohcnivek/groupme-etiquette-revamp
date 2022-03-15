import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {TextField, Button, Input} from "@mui/material/"
import { useNavigate, useLocation } from "react-router-dom";
import RankingScreen from "./RankingScreen";
import { listGroups } from "../logic";



function GroupScreen(props) {
    let navigate = useNavigate();
    const location = useLocation();

    let [groups, setGroups] = useState([]);

    console.log("in group screen")
    const INPUT_API_KEY = location.state.apiKey

    async function getGroups() {
        return await listGroups(INPUT_API_KEY)
            .then(res => 
                setGroups(res)
        )
    }

    useEffect(()=> {
        async function fetchGroups() {
            try {
                getGroups();
            } catch (err) {
              console.log('err-');
              console.error(err);
            }
        }

        fetchGroups()
    }, [])

    console.log(groups)

    
    return (
        <div>
            <h1> Chooose the group to analyze! </h1>
            <h5> (for right now the more the messages in the gc, the better) </h5>

            {groups.map( (group, index) => {
                return <Button onClick={() => navigate('/GroupScreen/RankingScreen', {state: {groupObject: group}})}> {index}. {group.name} </Button>
            }

            )}

            {/* <Button onClick={() => navigate('/GroupScreen/RankingScreen')}>Go to Ranking Screen</Button> */}
        </div>
        
    );
  }


export default GroupScreen;