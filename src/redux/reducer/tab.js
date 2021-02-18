import {
    SET_SELECTED_TAB_INDEX
} from '../../static/constant'

const initProfile = {
    selectedIndex: 0,
}

export default (state = initProfile, action) => {
    switch (action.type) {
        case SET_SELECTED_TAB_INDEX:
            console.log("action.payload : ", action.payload);
            return {
                selectedIndex: action.payload
            }
        default:
            return state
    }
}