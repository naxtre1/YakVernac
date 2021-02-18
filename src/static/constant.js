import {Dimensions} from 'react-native'

export const LOGIN = 'login'
export const SET_USERNAME = 'setUsername'
export const SET_INTRODUCTION = 'setIntroduction'
export const SET_SEX = 'setSex'
export const SET_MY_PIC = 'setMypic'
export const SET_XP = 'setXp'
export const LOGOUT = 'logout'
export const PROFILE_PAID = 'profilePaid'
export const REMOVE_INVITATION = 'removeInvitation'
export const ADD_INVITATION = 'addInvitation'
export const SET_INVITATION = 'setInvitation'
export const SET_FRIEND = 'setFriend'
export const SET_BLOCKED = 'setBlocked'
export const REMOVE_BLOCKED = 'removeBlocked'
export const REMMOVE_FRIEND = 'removeFriend'
export const ADD_FRIEND = 'addFriend'
export const CHANGE_MESSAGE = 'changeFriendLastMessage'
export const SET_LANG = 'setLang'
export const SET_FREE_TRANSLATIONS = 'setFreeTranslations'
export const SET_PROFILE_PICS = 'setProfilePics'
export const SET_ISLAND_PICS = 'setIslandPics'
export const SET_NOTIFY = 'setNotify'
export const SET_SELECTED_TAB_INDEX = 'setSelectedTabIndex'

export const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

export const colors = {
    button: 'white',
    blue: 'dodgerblue',
    opacityBlue: '#BCE0FD',
    green: '#2AD628',
    grey: '#ECECEC',
    mainBackground: '#D3F1FA',
    text: '#707070',
    lightGrey:'#F0F0F0',
    darkOrange:'#EC8F11',
    lightOrange:'#FFBE66',
    smackOrange:'#E8C461',
    selectionGreen:'#27D934',
    error:'#E24848',
    midBlue:'#27A8D9',
    stepColor:'#2699FB',
    black:'#000000'
}

export const styles = {
    container: {
        backgroundColor: '#D3F1FA',
        padding: 30
    },
    subcomponent: {
        margin: 10
    },
    outlineButton: {
        alignItems: 'center',
        margin: 10,
        backgroundColor: colors.button,
        padding: 10,
        borderRadius: 10
    },
    langButton: {
        alignItems: 'center',
        backgroundColor: colors.button,
        marginHorizontal: 10,
        marginVertical:8,
        paddingHorizontal: 8,
        paddingVertical:5,
        borderRadius: 10,
        flex:1,
        flexDirection:'row'
    },
    blueButton: {
        alignItems: 'center',
        margin: 10,
        backgroundColor: colors.blue,
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center'
    },
    simpleTextButton: {
        alignItems: 'center',
        margin: 10,
        width: '80%',
        alignSelf: 'center'
    },
    simpleText:{
        color: 'black',
        fontWeight: 'bold',
    },
    // blackButton: {
    //     alignItems: 'center',
    //     margin: 10,
    //     backgroundColor: 'transparent',
    //     padding: 10,
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     borderColor: 'black',
    //     width: '80%',
    //     alignSelf: 'center'
    // },
    blackButton: {
        flex:1,
        alignItems: 'center',
        margin: 10,
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        // width: '80%',
        alignSelf: 'center'
    },
    blackButtonFull: {
        flex:1,
        alignItems: 'center',
        margin: 10,
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        width: '80%',
        alignSelf: 'center'
    },
    divider: {
        height: 1,
        backgroundColor: 'grey',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10
    },
    topic: {
        backgroundColor: 'white',
        // paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 40,
        paddingRight: 40,
        alignItems: 'center'
    },
    gameLang: {
        marginBottom: 10,
        color: colors.blue,
        alignSelf: 'center'
    },
    blueBtnTitle: {
        color: 'white',
        fontWeight: 'bold',

    },
    blackueBtnTitle: {
        color: 'black',
        fontWeight: 'bold',

    },
    greenButton: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: colors.green,
        padding: 10,
    },
    greenButtonTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    },
}

export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function shuffleString(str) {
    var a = str.split(""), n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}

export function getLangInitial(lang) {
    switch(lang) {
        case 'Portuguese':
            return 'PT'
        case 'English':
            return 'EN'
        default:
            return ''
    }
}

export const maxCards = 5

