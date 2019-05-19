import { KEYWORDS, KeyItem } from './mapping-config';



export class Mapping {

    private _map: Map<string, (name, suffix) => string> = new Map<string, (name, suffix) => string>();

    constructor(){
        this.setMapping();
    }


    private setMapping(){

        for(let keyword in KEYWORDS){

            let keywords = KEYWORDS[keyword] as KeyItem[];

            keywords.forEach((item: KeyItem) => {
                this._map.set(item.key, item.content)
            })

        }

    }

    getVal(key: string){
        return this._map.get(key);
    }

}