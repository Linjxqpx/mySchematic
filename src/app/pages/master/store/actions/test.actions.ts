
import { Action } from '@ngrx/store';


export const SIMPLE_TYPE = '[SIMPLE_TYPE] Action Type';


export class TestAction implements Action {

    type: string = SIMPLE_TYPE;

    constructor(public payload :any){}
    
}


export type Actions = TestAction;