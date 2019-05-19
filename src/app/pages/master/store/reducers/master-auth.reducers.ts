

import * as simple from '../actions/member-auth.actions'

export interface State {
    detail: ViewModel
}

export const initialState: State = {
    detail: null
}

export function reducer(state = initialState, action: simple.Actions): State {
    switch (action.type) {
       
        case simple.LOAD_DETAIL_SUCCESS:
            return {
                ...state,
                detail: action.payload
            };
        default: {
            return state
        }
    }
}