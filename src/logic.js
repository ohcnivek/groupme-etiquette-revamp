import {ACCESS_TOKEN} from "./data"
import axios from "axios";


function getInitAPIRes() {
    return axios.get('https://api.groupme.com/v3/groups?token=' + ACCESS_TOKEN) 
        .then(res => {
            console.log(JSON.stringify(res));
            return res;
        })

}



export {getInitAPIRes};