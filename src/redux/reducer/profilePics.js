import {SET_PROFILE_PICS, LOGIN} from '../../static/constant'
import firestore from '@react-native-firebase/firestore'

export default (state={profilePics: []}, action) => {

    switch(action.type) {
        case LOGIN: {
            const {profilePics} = action.payload
            if (profilePics) {
                return {profilePics}
            }
            return {profilePics: []}
        }
        case SET_PROFILE_PICS:
            const {uid, profilePics} = action.payload
            firestore().collection('user').doc(uid).update({profilePics})
            return {profilePics}
        default:
            return state
    }
}