
import { Action } from '@ngrx/store';


export const SIMPLE_TYPE = '[SIMPLE_TYPE] Action Type';


export class MasterAction implements Action {

    type: string = SIMPLE_TYPE;

    constructor(public payload :any){}
    
}


export type Actions = MasterAction;