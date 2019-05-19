import { InsertChange } from '@schematics/angular/utility/change';
import { Tree } from '@angular-devkit/schematics';
import * as stringUtils from '../strings';
import { Mapping } from './mapping';
import { KEYWORDS, KeyItem, TYPENAME } from './mapping-config';


// const EXPORT_KEYWORDS = [
    // "export {",
    // "export{"
// ]

 

export class DataItem {
    type: string; 
    path: string;
    insertChanges: InsertChange[]
}

export class InserDataList {

    datas: DataItem[];

    constructor(className: string, paths: string[], host: Tree){
        this.datas = this.getDatas(className, paths, host);
    }

    private getDatas(className: string, paths: string[], host: Tree) {
        return paths.map(x => {
            let pathArr = x.split("/");
            let lasttwo = pathArr[(pathArr.length - 2)]; // 取得資料夾名稱
            let importName, importPathName, suffix: string;
            
            // let exportIndex = getExportPosIndex(host, x);
            
            // if(exportIndex == -1) throw new Error(`找不到符合keyword: '${EXPORT_KEYWORDS.join(" or ")}' , path: ${x}`);
            // console.log("insert index exportIndex: ", exportIndex);
            
            // suffix = firstCharToUpperCase(lasttwo);

            // importName = `${stringUtils.defaultName(className, stringUtils.classify, "類別名稱")}${suffix}`;
            // importPathName = `${stringUtils.defaultName(className, stringUtils.dasherize, "類別名稱")}.${suffix.toLowerCase()}`;

            // const importContentStr = `import * as ${importName} from './${importPathName}';\r\n`;
            // const exportContentStr = `\r\n\t${importName},`;

            // let importContent = new InsertChange(x, 0, importContentStr);
            // let exportContent = new InsertChange(x, exportIndex, exportContentStr)

            suffix = firstCharToUpperCase(lasttwo);
            let insertChanges = getInsertChanges(x, lasttwo, suffix, className, host);

            let dataItem = new DataItem();
            dataItem.type = suffix;
            dataItem.path = x;
            dataItem.insertChanges = insertChanges;

            return dataItem;
        })
    }

}


function getInsertChanges(path: string, type: string, suffix: string, className: string, host: Tree): InsertChange[]{

    let insertChanges: InsertChange[] = [];
    let content = host.read(path);

    if(content){

        let mapping = new Mapping();
        let typeToLowerCase = type.toLowerCase();

        let keywords: KeyItem[] = KEYWORDS[typeToLowerCase] as KeyItem[];
        
        keywords.forEach(keyword => {

            let index = getExportPosIndex(content.toString(), keyword.key);
            if(index == -1) return;
    
            let getContent = mapping.getVal(keyword.key);
    
            let insertChange = new InsertChange(path, index, getContent(className, suffix));
            insertChanges.push(insertChange);
    
        })
    
        if(insertChanges.length <= 0) throw new Error(`找不到符合keyword: '${keywords.map(x => x.key).join(" or ")}' , path: ${path}`)
    
        let getImportContent = mapping.getVal((typeToLowerCase == TYPENAME.ACTIONS.toLowerCase() ? "actionInclude" : "include"));
        
        let importInsertChange = new InsertChange(path, 0, getImportContent(className, suffix));
        insertChanges.push(importInsertChange);
    
        return insertChanges;

    }
    else throw new Error(`找不到檔案!!, path: ${path}`)

    
    // switch (type.toLowerCase()) {
    //     case "actions":

    //         KEYWORDS.actions.forEach(keyword => {
    //             let index = getExportPosIndex(content.toString(), keyword.key);
    //             if(index == -1) return;

    //             let getContent = mapping.getVal(keyword.key);

    //             let insertChange = new InsertChange(path, index, getContent(className, suffix));
    //             insertChanges.push(insertChange);

    //         })

    //         break;
    //     case "effects":
    //         suffix = "Effects";
    //         break;
    //     case "reducers":
    //         suffix = "Reducers";
    //         break;
    //     default:
    //         break;
    // }

}

function getExportPosIndex(fileContent: string, keyword: string): number{
    let index = -1;

    if(fileContent.indexOf(keyword) != -1){
        console.log(`contnetStr find '${keyword}' index: `, fileContent.indexOf(keyword));
        console.log(`'${keyword}'.length: ` , keyword.length);
        index = fileContent.indexOf(keyword) + keyword.length;
    }

    return index;
}


function firstCharToUpperCase(type: string): string{
    let suffix = '';

    switch (type) {
        case "actions":
            suffix = TYPENAME.ACTIONS;
            break;
        case "effects":
            suffix = TYPENAME.EFFECTS;
            break;
        case "reducers":
            suffix = TYPENAME.REDUCERS;
            break;
        default:
            break;
    }

    return suffix;
}