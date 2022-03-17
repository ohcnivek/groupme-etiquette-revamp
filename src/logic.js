import axios from "axios";


async function fetchGroups(userAPIKey) {
    let response = await axios.get('https://api.groupme.com/v3/groups?token=' + userAPIKey);
    return response
}

async function listGroups(userAPIKey) {
    let res  = await fetchGroups(userAPIKey);
    let groupList = res.data['response']
    return groupList;
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

async function getGroupMessageCountAndMessages(group, params, userAPIKey) {
    let messageCount;
    let messages;

    try {
        let group_response  =  await axios.get("https://api.groupme.com/v3/groups/"+ group['id'] +"/messages?token=" + userAPIKey, params); 
        messageCount = await group_response['data']['response']['count'];
        messages = await group_response['data']['response']['messages'];
    
        return {'messages': messages, 'messageCount': messageCount }
    } catch (e) {
        throw new Error("done getting messages")
    }
    
}

async function getUserMap(group, userAPIKey) {
    let members = group['members']
    let params = {
        params: {
          limit: 100, 
        }
      }

    let user_map = prepare_user_dictionary(members);
    let response = await getGroupMessageCountAndMessages(group, params, userAPIKey);
    let messages = response['messages']
    let last_messageID; 
    let ranOutOfMessages = false ;

    while (!ranOutOfMessages) {
        if (last_messageID) {
            params['params']['before_id'] = last_messageID; // Broken, need to figure out last ID thing
        } 
        try {
            response = await getGroupMessageCountAndMessages(group, params, userAPIKey);
            messages = response['messages']
        } catch (e) {
            ranOutOfMessages = !ranOutOfMessages;

        }
        
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i]; 
            if (message['name'] === "GroupMe") {
                continue;
            }
        //  State of senders in user map{'name': name, 'messages_sent': 0, 'likes_given': 0, 'likes_received': 0, 'words_sent': 0, 'likes_by_member': {}, 'shared_likes': {}, 'self_likes': 0}
            let sender_id = message['sender_id']
            let likers = message['favorited_by']

            let currStateOfSender = user_map.get(sender_id);
            if (!currStateOfSender) {
                continue;
            }
            currStateOfSender['messages_sent'] = currStateOfSender['messages_sent'] + 1;

            let likes_received = likers.length;

            for (let j = 0; j < likers.length; j++) {
                let liker_id = likers[j]
                if (sender_id === liker_id) { // self like
                    likes_received--;
                    currStateOfSender['self_likes'] = currStateOfSender['self_likes'] + 1
                    user_map.set(sender_id, currStateOfSender); // done with updates to messages sender
                    continue;
                }
                
                let currStateOfLiker = user_map.get(liker_id)
                if (!currStateOfLiker) {
                    continue;
                }
                currStateOfLiker['likes_given'] = currStateOfLiker['likes_given'] + 1
                user_map.set(liker_id, currStateOfLiker); // done with udpates to liker
            }
            currStateOfSender['likes_received'] = currStateOfSender['likes_received'] + likes_received;
            user_map.set(sender_id, currStateOfSender); // done with updates to messages sender
        }
        last_messageID = messages[messages.length - 1]['id'];
    }

    return user_map;
}


async function getRankings(group, userAPIKey) {
    let response = await getUserMap(group, userAPIKey) 
    let ranking = [];

    for (let [key, value] of  response.entries()) {
        if (value['messages_sent'] > 0) {
            const userToRatio = [ value['likes_received'] * 1.0 / value['messages_sent'] * 1.0, value['name']]
            ranking.push(userToRatio)
        }
    }

    ranking.sort(sortFunction) // will sort so that the greatest is in the front 

    //top 10
    let portion = Math.round(ranking.length * .15)
    let topRanks = []
    for (let i = 0; i < portion; i++) {
        if (i < ranking.length) {
            topRanks.push(ranking[i])
        } else {
            break;
        }
    }

    //bottom 10
    let bottomRanks = []
    for (let i = ranking.length - 1; i > ranking.length - 1 - portion; i--) {
        if (i >= 0) { // avoiding out of bounds
            bottomRanks.push(ranking[i])
        } else {
            break;
        }
    }

    let topANDbottomRes = [topRanks, bottomRanks]
    return topANDbottomRes;
}


function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}



export {fetchGroups, listGroups, getGroupMessageCountAndMessages, getUserMap, getRankings as main};