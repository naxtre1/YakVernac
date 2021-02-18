import { combineReducers } from 'redux'
import user from './user'
import Invitations from './Invitations'
import friends from './friends'
import lang from './lang'
import blockeds from './blockeds'
import profilePics from './profilePics'
import islandPics from './islandPics'
import xp from './xp'
import tab from './tab'

const rootReducer = combineReducers({
    user,
    Invitations,
    friends,
    lang,
    blockeds,
    profilePics,
    islandPics,
    xp,
    tab
})

export default rootReducer
