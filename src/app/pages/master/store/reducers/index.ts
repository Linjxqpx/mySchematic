import * as fromMasterAuthReducers from './master-auth.reducers';

        
export interface IndexState {
	masterAuth: fromMasterAuthReducers.State,
}
        
export const reducers = {
	masterAuth: fromMasterAuthReducers.reducer,
}
    