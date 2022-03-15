import axios from "axios";


async function fetchGroups(userAPIKey) {
    // userAPIKey = ACCESS_TOKEN
    let response = await axios.get('https://api.groupme.com/v3/groups?token=' + userAPIKey);
    return response
}

async function listGroups(userAPIKey) {
    let res  = await fetchGroups(userAPIKey);
    let groupList = res.data['response']
    // console.log(groupList)
    // console.log("Choose your group!")
    // for (let i = 0; i < groupList.length; i++) {
    //     console.log(`${i}. ` + groupList[i].name);
    // }
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
    // GET ALL MEMEBERS AND PREP DICTIONARY 
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

async function analyzeMessages(group, userAPIKey) {
    // TODO: Helper Method
    // let res  = await fetchGroups();
    // let groupList = res.data['response']
    // let group = groupList[0]; // this is gonna be the chosen group that is passed in later, rn just chooses the most recently messaged in chat
    let members = group['members']

    let params = {
        params: {
          limit: 100, 
        }
      }

    let user_map = prepare_user_dictionary(members);
    let response = await getGroupMessageCountAndMessages(group, params, userAPIKey);
    let messages = response['messages']

    // console.log(JSON.stringify(messageCount, null, 4))
    // console.log(JSON.stringify(messages, null, 4))

    let last_messageID; 
    let ranOutOfMessages = false ;

    while (!ranOutOfMessages) {
        if (last_messageID) {
            console.log("last message not null")
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
            // console.log(message)

            if (message['name'] === "GroupMe") {
                continue;
            }
        //     // DO UPDATES HERE
        //     // TO UPDATE {'name': name, 'messages_sent': 0, 'likes_given': 0, 'likes_received': 0, 'words_sent': 0, 'likes_by_member': {}, 'shared_likes': {}, 'self_likes': 0}
            let sender_id = message['sender_id']
            let likers = message['favorited_by']

            let currStateOfSender = user_map.get(sender_id);
            console.log(currStateOfSender)

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
        // console.log(messages[messages.length - 1])
        last_messageID = messages[messages.length - 1]['id'];
    }

    return user_map;
}


async function getRankings(group, userAPIKey) {
    let response = await analyzeMessages(group, userAPIKey) 

    let ranking = [];

    for (let [key, value] of  response.entries()) {
        if (value['messages_sent'] > 0) {
            const userToRatio = [ value['likes_received'] * 1.0 / value['messages_sent'] * 1.0, value['name']]
            ranking.push(userToRatio)
        }
    }

    ranking.sort(sortFunction)
    console.log(ranking)

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

    // ranking.length * .1 
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



export {fetchGroups, listGroups, getGroupMessageCountAndMessages, analyzeMessages, getRankings as main};