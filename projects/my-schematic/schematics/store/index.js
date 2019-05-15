"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const stringUtils = require("../strings");
function default_1(_options) {
    return (tree, _context) => {
        console.log(_options);
        const path = _options.path == undefined ? "/" : _options.path + "/";
        const destPath = core_1.normalize(path);
        const templateSource = schematics_1.apply(schematics_1.url('./files/'), [
            schematics_1.template(Object.assign({}, stringUtils, _options)),
            schematics_1.move(destPath)
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                schematics_1.mergeWith(templateSource)
            ])) //,
            //_options.skipAddIndex ? noop() : addIndexFile(_options, destPath)
        ])(tree, _context);
    };
}
exports.default = default_1;
function addIndexFile(_options, path) {
    console.log("addIndexFile");
    return (tree, _context) => {
        const filterRole = findIndexFileRule();
        const dir = schematics_1.apply(schematics_1.url('../../testsrc'), [filterRole])(_context);
        dir.subscribe(x => {
            x.visit(g => {
                console.log(g);
                let updateRecorder = tree.beginUpdate(g);
                updateRecorder.insertLeft(0, 'test');
                tree.commitUpdate(updateRecorder);
            });
        });
        return tree;
    };
}
function findIndexFileRule() {
    const actionPath = "actions/index.ts";
    const effectPath = "effects/index.ts";
    const reducerPath = "reducers/index.ts";
    return schematics_1.filter(x => {
        let paths = x.split("/");
        let last = paths[(paths.length - 1)];
        let lasttwo = paths[(paths.length - 2)];
        let combineName = lasttwo + "/" + last;
        let isIndex = false;
        if (combineName == actionPath ||
            combineName == effectPath ||
            combineName == reducerPath) {
            isIndex = true;
        }
        return isIndex;
    });
}
