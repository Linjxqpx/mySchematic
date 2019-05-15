

import * as <%= defaultName(actionName, camelize) %> from '../actions/member-auth.actions'

export interface State {
    detail: ViewModel
}

export const initialState: State = {
    detail: null
}

export function reducer(state = initialState, action: <%= defaultName(actionName, camelize) %>.Actions): State {
    switch (action.type) {
       
        case <%= defaultName(actionName, camelize) %>.LOAD_DETAIL_SUCCESS:
            return {
                ...state,
                detail: action.payload
            };
        default: {
            return state
        }
    }
}