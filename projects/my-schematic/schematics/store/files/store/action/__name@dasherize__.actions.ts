
import { Action } from '@ngrx/store';


export const SIMPLE_TYPE = '[SIMPLE_TYPE] Action Type';


export class <%= classify(name) %>Action implements Action {

    type: string = SIMPLE_TYPE;

    constructor(public payload :any){}
    
}


export type Actions = <%= classify(name) %>Action;