import React, { useState, useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import {TextField, Button, Input} from "@mui/material/"
import { useNavigate, useLocation } from "react-router-dom";
import {main} from "../logic"



function RankingScreen(props) {
    const location = useLocation();

    let [userMap, setUserMap] = useState({});

    const group = location.state.groupObject

    async function getUserMap() {
        return await main(group).then(
            res => {
                setUserMap(res)
            }
        )
    }

    useEffect(()=> {
        async function fetchUserMap() {
            try {
                getUserMap();
            } catch (err) {
              console.log('err-');
              console.error(err);
            }
        }

        fetchUserMap()
    }, [])

    console.log(userMap)

    

    console.log(group)

    
    console.log("in ranking screen")
    
    return (
        <h1>Ranking Screen </h1>
    );
  }


export default RankingScreen;