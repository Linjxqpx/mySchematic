

import * as stringUtils from '../strings';


export interface KeywordInterfaec {
    include: KeyItem[];
    actions: KeyItem[],
    effects: KeyItem[],
    reducers: KeyItem[]
}

export interface KeyItem {
    key: string;
    content: (className: string, suffix: SuffixType) => string
}


export enum TYPENAME {
    ACTIONS = "Actions",
    EFFECTS = "Effects",
    REDUCERS = "Reducers"
}

type SuffixType = "Actions" | "Effects" | "Reducers";

export const KEYWORDS: KeywordInterfaec = {

    include: [
        {
            key: "include", 
            content: (className: string, suffix: SuffixType) => `import * as ${getClassName(className, suffix, "from")} from './${getFileName(className, suffix)}';\r\n`            
        },
        {
            key: "actionInclude",
            content: (className: string, suffix: SuffixType) => `import * as ${getClassName(className, suffix)} from './${getFileName(className, suffix)}';\r\n`            
        }
    ],

    actions: [
        {
            key: "export {",
            content: (className: string, suffix: SuffixType) => `\r\n\t${getClassName(className, suffix)},`
        }
    ],

    effects: [
        {
            key: "export const effects = [",
            content: (className: string, suffix: SuffixType) => `\r\n\t${getClassName(className, suffix, "from")},`
        }
    ],

    reducers: [
        {
            key: "export const reducers = {",
            content: (className: string, suffix: SuffixType) => `\r\n\t${getPerportyAndVal(className, suffix, "from")}.reducer,`
        },
        {
            key: "export interface State {",
            content: (className: string, suffix: SuffixType) => `\r\n\t${getPerportyAndVal(className, suffix, "from")}.State,`
        },
        {
            key: "export interface IndexState {",
            content: (className: string, suffix: SuffixType) => `\r\n\t${getPerportyAndVal(className, suffix, "from")}.State,`
        }
    ]
}




export const IndexTsFileDefaultContent = {

    action: `
        \r\nexport {\r\n}
    `,

    effect: `
        \r\nexport const effects = [\r\n]
    `,

    reducer:`
        \r\nexport interface IndexState {\r\n}
        \r\nexport const reducers = {\r\n}
    `
}

function getFileName(className: string, suffix: SuffixType){
    let valName = stringUtils.defaultName(className, stringUtils.dasherize, "類別名稱");
    return `${valName}.${suffix.toLowerCase()}`;
}

function getClassName(className: string, suffix: SuffixType, prefix?: string){
    let valName = stringUtils.defaultName(className, stringUtils.classify, "類別名稱");
    return `${(prefix ? prefix : '')}${valName}${suffix}`;
}

function getPerportyAndVal(className: string, suffix: SuffixType, prefix: string) {

    //let valName = stringUtils.defaultName(className, stringUtils.classify, "類別名稱");
    let propName = stringUtils.defaultName(className, stringUtils.camelize, "類別名稱");

    return `${propName}: ${getClassName(className, suffix, prefix)}`;
}

