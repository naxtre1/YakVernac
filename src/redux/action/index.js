import {
    LOGIN,
    SET_USERNAME,
    SET_INTRODUCTION,
    LOGOUT,
    SET_SEX,
    SET_NOTIFY,
    SET_MY_PIC,
    REMOVE_INVITATION,
    SET_INVITATION,
    ADD_FRIEND,
    SET_FRIEND,
    SET_LANG,
    SET_XP,
    REMMOVE_FRIEND,
    SET_FREE_TRANSLATIONS,
    SET_BLOCKED,
    REMOVE_BLOCKED,
    SET_PROFILE_PICS,
    SET_ISLAND_PICS,
    CHANGE_MESSAGE,
    PROFILE_PAID,
    SET_SELECTED_TAB_INDEX
} from '../../static/constant'

export const login = user => {
    return {
        type: LOGIN,
        payload: user
    }
}

export const logout = ()=>{
    return {
        type: LOGOUT
    }
}

export const removeInvitation = id => {
    return {
        type: REMOVE_INVITATION,
        payload: id
    }
}

export const setInvitation = Invitations => {
    return {
        type: SET_INVITATION,
        payload: Invitations
    }
}

export const setFriends = friends => {
    return {
        type: SET_FRIEND,
        payload: friends
    }
}

export const addFriend = (uid, friendID, friend) => {
    return {
        type: ADD_FRIEND,
        payload: {
            uid, friendID, friend
        }
    }
}

export const setLang = lang => {
    return {
        type: SET_LANG,
        payload: lang
    }
}

export const setXp = (uid, xp) => {
    return {
        type: SET_XP,
        payload: {uid, xp}
    }
}

export const removeFriend = (uid, friendID)=>{
    return {
        type: REMMOVE_FRIEND,
        payload: {
            uid, friendID
        }
    }
}

export const setFreeTranslations = freeTranslations => {
    return {
        type: SET_FREE_TRANSLATIONS,
        payload: freeTranslations
    }
}

export const setBlockeds = blockeds => {
    return {
        type: SET_BLOCKED,
        payload: blockeds
    }
}

export const removeBlockeds = (uid, blockedByID) => {
    return {
        type: REMOVE_BLOCKED,
        payload: {
            uid, blockedByID
        }
    }
}

export const setProfilePics = (uid, profilePics) => {
    return {
        type: SET_PROFILE_PICS,
        payload: {uid, profilePics}
    }
}

export const setIslandPics = (uid, islandPics) => {
    return {
        type: SET_ISLAND_PICS,
        payload: {uid, islandPics}
    }
}

export const changeFriendLastMessage = (friendID, message) => {
    return {
        type: CHANGE_MESSAGE,
        payload: {
            friendID, message
        }
    }
}

export const setSex = sex => {
    return {
        type: SET_SEX,
        payload: sex
    }
}

export const setMypic = myPic => {
    return {
        type: SET_MY_PIC,
        payload: myPic
    }
}

export const setNotify = notify => {
    return {
        type: SET_NOTIFY,
        payload: notify
    }
}

export const setUsername = username => {
    return {
        type: SET_USERNAME,
        payload: username
    }
}

export const setIntroduction = introduction => {
    return {
        type: SET_INTRODUCTION,
        payload: introduction
    }
}

export const setProfilePremium = (premium) => {
    return {
        type: PROFILE_PAID,
        payload: premium
    }
}

export const setSelectedTabIndex = index => {
    return {
        type: SET_SELECTED_TAB_INDEX,
        payload: index
    }
}