import firestore from '@react-native-firebase/firestore'
import {SET_BLOCKED, REMOVE_BLOCKED} from '../../static/constant'

export default (state={}, action) => {
    switch(action.type) {
        case SET_BLOCKED:
            return {...action.payload}
        case REMOVE_BLOCKED:
            const {uid, blockedByID} = action.payload
            delete state[blockedByID]
            const blockedBy = []
            for (const key in state) {
                blockedBy.push(state[key])
            }
            firestore().collection('user').doc(uid).update({blockedBy})
            return {
                ...state
            }
        default:
            break
    }
    return state
}