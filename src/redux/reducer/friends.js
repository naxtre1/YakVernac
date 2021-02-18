import firestore from '@react-native-firebase/firestore'
import {SET_FRIEND, REMMOVE_FRIEND, ADD_FRIEND, CHANGE_MESSAGE} from '../../static/constant'

export default (state={}, action) => {
    switch(action.type) {
        case SET_FRIEND:
            return {...action.payload}
        case CHANGE_MESSAGE: {
            const {friendID, message} = action.payload
            if (state[friendID]) {
                if (message.length > 25) {
                    state[friendID]['lastMessage'] = message.substring(0, 25)+'...'
                } else {
                    state[friendID]['lastMessage'] = message
                }
                return {
                    ...state
                }
    
            }
            break
        }
        case REMMOVE_FRIEND:
            const {uid, friendID} = action.payload
            delete state[friendID]
            const friends = []
            for (const key in state) {
                friends.push(key)
            }
            firestore().collection('user').doc(uid).update({friends})
            return {
                ...state
            }
        case ADD_FRIEND: {
            const {uid, friendID, friend} = action.payload
            const friends = []
            for (const key in state) {
                if (friendID == key) {
                    return state
                }
                friends.push(key)
            }
            friends.push(friendID)
            firestore().collection('user').doc(uid).update({friends})
            state[friendID] = friend
            return {
                ...state
            }

        }
        default:
            break
    }
    return state
}