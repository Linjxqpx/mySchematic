import {Schema as ComponentSchema} from '@schematics/angular/component/schema';

export interface Schema extends ComponentSchema{

    name: string;

    
    path: string;

    
    actionName: string;

    
    storeState: string;

    
    skipAddIndex: boolean;

    
    ignoreEffect: boolean;

}