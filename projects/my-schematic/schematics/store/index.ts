import {
  Rule, SchematicContext, Tree, url, filter, 
  move, chain, branchAndMerge, mergeWith, noop, apply, template
} from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import {getProjectFromWorkspace, getProjectMainFile} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import { InsertChange } from '@schematics/angular/utility/change';


import { Schema } from './schema';
import * as stringUtils from '../strings';
import { Observable } from 'rxjs';
import { InserDataList } from './insertDataList';
import { IndexTsFileDefaultContent } from './mapping-config';


const DEFAULT_PATH = "/src/app/pages/master";

export default function(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
    console.log(_options);

    const path = _options.path == undefined ? DEFAULT_PATH : _options.path + "/";
    const destPath = normalize(path);

    
    const templateSource = apply(url('./files/'), [
      _options.ignoreEffect ? ignoreEffect() : noop(),
      template({ ...stringUtils, ..._options }),
      move(destPath)
    ]);



    return chain([
      branchAndMerge(
        chain([
          mergeWith(templateSource),
          _options.skipAddIndex ? noop() : insertIndexFile(destPath, _options)
        ])
      )
    ])(tree, _context);
  };
}



function insertIndexFile(path: string, options: Schema){
  
  const rootPath = path + "/store/";
  const actionPath = rootPath + "actions/index.ts";
  const effectPath = rootPath + "effects/index.ts";
  const reducerPath = rootPath + "reducers/index.ts";
  let allPath = [actionPath, reducerPath];

  return function(host: Tree, _context: SchematicContext){

    if(options.ignoreEffect == false) allPath.push(effectPath);

    allPath.forEach(path => {
      if(!host.exists(path))
        createIndexFile(host, path)
    })

    // 取得 insertDataList 物件, 整理 insert 的資料及位置
    let inserDataList = new InserDataList(options.name, allPath, host);

    // 開始 insert String 到 index.ts 
    inserDataList.datas.forEach(dataItem => {
      let updateRecorder = host.beginUpdate(dataItem.path);

      dataItem.insertChanges.forEach(insertItem => {
        updateRecorder.insertLeft(insertItem.pos, insertItem.toAdd);
      })

      host.commitUpdate(updateRecorder);
    })
    
    return host;
  };

}

function ignoreEffect(): Rule{
  return filter(x => {
    
    let pathArr = x.split("/");
    let lasttwo = pathArr[(pathArr.length - 2)];

    return lasttwo != "effects";
  })
}

function createIndexFile(host: Tree, path: string){
  let pathArr = path.split("/");
  let dirName = pathArr[(pathArr.length - 2)]; // 取得資料夾名稱
  let content;
  if(dirName == "actions")
    content = IndexTsFileDefaultContent.action
  else if(dirName == "effects")
    content = IndexTsFileDefaultContent.effect
  else if(dirName == "reducers")
    content = IndexTsFileDefaultContent.reducer
  else
    throw new Error("目錄結構不屬於 actions or effects or reducers 其中一個, 目錄為: "+ path)

  host.create(path, content);
}
