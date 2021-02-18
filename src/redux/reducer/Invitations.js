import {ADD_INVITATION, REMOVE_INVITATION, SET_INVITATION} from '../../static/constant'

export default (state={}, action) => {
    switch(action.type) {
        case SET_INVITATION: {
            const Invitations = action.payload
            return {...Invitations}
        }
        case ADD_INVITATION:
            return {...state}
        case REMOVE_INVITATION:
            const invitation = action.payload
            const id = action
            delete invitation[id]
            return {...invitation}
        default:
            return state
    }
}