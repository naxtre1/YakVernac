import {SET_ISLAND_PICS, LOGIN} from '../../static/constant'
import firestore from '@react-native-firebase/firestore'

export default (state=[], action) => {
    switch(action.type) {
        case LOGIN: {
            const {islandPics} = action.payload
            if (islandPics) {
                return islandPics

            }
            return []
        }
        case SET_ISLAND_PICS:
            const {uid, islandPics} = action.payload
            firestore().collection('user').doc(uid).update({islandPics})
            return islandPics
        default:
            return state
    }
}