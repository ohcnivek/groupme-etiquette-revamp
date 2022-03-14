import {ACCESS_TOKEN} from "./data"
import axios from "axios";


async function fetchGroups() {
    let response = await axios.get('https://api.groupme.com/v3/groups?token=' + ACCESS_TOKEN);
    return response
}

async function listGroups() {
    let res  = await fetchGroups();
    let groupList = res.data['response']
    console.log(groupList)
    console.log("Choose your group!")
    for (let i = 0; i < groupList.length; i++) {
        console.log(`${i}. ` + groupList[i].name);
    }
}

function createNewUser(name) {
    return {'name': name, 'messages_sent': 0, 'likes_given': 0, 'likes_received': 0, 'words_sent': 0, 'likes_by_member': {}, 'shared_likes': {}, 'self_likes': 0}
}

function prepare_user_dictionary(members) {
    const user_map = new Map()
    for (let i = 0; i < members.length; i++) {
        let member = members[i]; // member object 
        user_map.set(member['user_id'], createNewUser(member['name']));
    }
    return user_map
}

async function getGroupMessageCountAndMessages(group, params) {
    // GET ALL MEMEBERS AND PREP DICTIONARY 
    let group_response  =  await axios.get("https://api.groupme.com/v3/groups/"+ group['id'] +"/messages?token=" + ACCESS_TOKEN, params); 
    let messageCount = await group_response['data']['response']['count'];
    let messages = await group_response['data']['response']['messages'];

    return {'messages': messages, 'messageCount': messageCount }
}

async function analyzeMessages() {
    // TODO: Helper Method
    let res  = await fetchGroups();
    let groupList = res.data['response']
    let group = groupList[0]; // this is gonna be the chosen group that is passed in later, rn just chooses the most recently messaged in chat
    let members = group['members']


    let params = {
        params: {
          limit: 100, 
        }
      }

    console.log(prepare_user_dictionary(members));
    let response = await getGroupMessageCountAndMessages(group, params);
    let messages = response['messages']
    let messageCount = response['messageCount']


    console.log(JSON.stringify(messageCount, null, 4))
    console.log(JSON.stringify(messages, null, 4))

    let messagesAnalyzed = 0;


    while (messagesAnalyzed < messageCount) {
        response = await getGroupMessageCountAndMessages(group, params);
        messages = response['messages']

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i]; 
            // { THIS IS WHAT MESSAGE IS SHAPED AS
            //     "attachments": [],
            //     "avatar_url": "https://i.groupme.com/1024x1024.jpeg.2cace9d1dd3d4a82b6bf7a065adff50d",
            //     "created_at": 1647226133,
            //     "favorited_by": [
            //         "28611855"
            //     ],
            //     "group_id": "84331570",
            //     "id": "164722613304138825",
            //     "name": "David Cornell",
            //     "sender_id": "25800448",
            //     "sender_type": "user",
            //     "source_guid": "58EAF64A-EE91-427D-9E1B-2CF228670CC0",
            //     "system": false,
            //     "text": "Also reminder we have in person lecture tomorrow",
            //     "user_id": "25800448",
            //     "platform": "gm"
            // },

            let name = message['name'];
            let sender_id = message['sender_id']
            let likers = message['favorited_by']

            messagesAnalyzed++; 
        }

        
    }


}



export {fetchGroups, listGroups, getGroupMessageCountAndMessages, analyzeMessages};