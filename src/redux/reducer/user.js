import {
    LOGIN,
    SET_USERNAME,
    SET_INTRODUCTION,
    LOGOUT,
    SET_FREE_TRANSLATIONS,
    SET_SEX,
    SET_MY_PIC,
    SET_NOTIFY,
    PROFILE_PAID
} from '../../static/constant'
import firestore from '@react-native-firebase/firestore'

const initProfile = {
    age: '',
    username: '',
    uid: '',
    interests: '',
    introduction: '',
    myPic: '',
    sex: 'male',
    notify: 1,
    premium: false,
}

export default (state = initProfile, action) => {
    switch (action.type) {
        case LOGIN:
            const { age, username, uid, interests, introduction, myPic, sex, notify, premium, playerId, until, amount, untilNice, created } = action.payload
            return {
                age, username, uid, interests, introduction, myPic, sex, notify, premium, playerId, until, amount, untilNice, created
            }
        case SET_USERNAME: {
            const username = action.payload
            firestore().collection('user').doc(state.uid).update({ username })
            return {
                ...state, username
            }
        }
        case SET_INTRODUCTION: {
            const introduction = action.payload
            firestore().collection('user').doc(state.uid).update({ introduction })
            return {
                ...state, introduction
            }
        }
        case SET_FREE_TRANSLATIONS:
            const freeTranslations = action.payload
            firestore().collection('user').doc(state.uid).update({ freeTranslations })
            return {
                ...state,
                freeTranslations
            }
        case SET_SEX: {
            const sex = action.payload
            firestore().collection('user').doc(state.uid).update({ sex })
            return { ...state, sex }
        }
        case SET_MY_PIC: {
            const myPic = action.payload
            firestore().collection('user').doc(state.uid).update({ myPic })
            return { ...state, myPic }
        }
        case SET_NOTIFY: {
            const notify = action.payload
            firestore().collection('user').doc(state.uid).update({ notify })
            return { ...state, notify }
        }
        case PROFILE_PAID: {
            let paidData = action.payload
            console.log("paidData : ", paidData);
            return { ...state, 
                premium: paidData?.premium,
                until: paidData?.until,
                untilNice: paidData?.untilNice,
                amount: paidData?.amount,
                months: paidData?.months,
                created: paidData?.created
             }
        }
        case LOGOUT:
            return initProfile
        default:
            return state
    }
}