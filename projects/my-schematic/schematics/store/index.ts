import {
  Rule, SchematicContext, Tree, url, filter, 
  move, chain, branchAndMerge, mergeWith, noop, apply, template
} from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';

import { Schema } from './schema'
import * as stringUtils from '../strings';
import { Observable } from 'rxjs';




export default function(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
    console.log(_options);

    const path = _options.path == undefined ? "/" : _options.path + "/";
    const destPath = normalize(path);

    const templateSource = apply(url('./files/'), [
      template({ ...stringUtils, ..._options } as any),
      move(destPath)
    ]);



    return chain([
      branchAndMerge(
        chain([
          mergeWith(templateSource)
        ])
      )//,
      //_options.skipAddIndex ? noop() : addIndexFile(_options, destPath)
    ])(tree, _context);
  };
}


function addIndexFile(_options: Schema, path: string): Rule{
  console.log("addIndexFile");
  return (tree: Tree, _context: SchematicContext) => {

    const filterRole = findIndexFileRule();
    

    var a = apply(url('../../testsrc'), [filterRole])

    const dir = apply(url('../../testsrc'), [filterRole])(_context) as Observable<Tree>;
    dir.subscribe(x => {
      x.visit(g => {
        console.log(g);
        let updateRecorder = tree.beginUpdate(g);
        updateRecorder.insertLeft(0, 'test');
        tree.commitUpdate(updateRecorder);
      });
    })
    
    return tree;
  }
}

function findIndexFileRule(){
  const actionPath = "actions/index.ts";
  const effectPath = "effects/index.ts";
  const reducerPath = "reducers/index.ts";

  return filter(x => {
    let paths = x.split("/");
    let last = paths[(paths.length - 1)]; 
    let lasttwo = paths[(paths.length - 2)];
    let combineName = lasttwo + "/" + last;
    let isIndex = false; 

    if(
      combineName == actionPath || 
      combineName == effectPath || 
      combineName == reducerPath
    ){
      isIndex = true;
    }


    return isIndex;
  });

}
