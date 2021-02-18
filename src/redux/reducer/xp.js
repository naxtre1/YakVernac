import {SET_XP, LOGIN} from '../../static/constant'
import firestore from '@react-native-firebase/firestore'

export default (state = 0, action) => {
    switch (action.type) {
        case LOGIN:
            if (action.payload.xp) {
                return action.payload.xp
            }
            return state
        case SET_XP:
            const {uid, xp} = action.payload
            firestore().collection('user').doc(uid).update({xp})
            return xp
        default:
            return state
    }
}