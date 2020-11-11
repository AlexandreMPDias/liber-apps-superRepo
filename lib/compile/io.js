"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const read = (file) => JSON.parse(fs_1.readFileSync(file, { encoding: "utf-8" }));
const write = (file, content) => fs_1.writeFileSync(file, JSON.stringify(content, null, "\t"), {
    encoding: "utf-8",
});
class File {
    constructor(p) {
        this.update = () => {
            write(this.path, this.content);
        };
        this.path = p;
        this.content = read(this.path);
    }
}
exports.File = File;
const init = () => {
    const [sourceFile, possibleTargetPkgJson] = process.argv.slice(2);
    const packageJsonPath = possibleTargetPkgJson ||
        path.join(path.dirname(sourceFile), "package.json");
    const source = new File(sourceFile);
    const packageJson = new File(packageJsonPath);
    return {
        source,
        packageJson,
    };
};
exports.default = { init };
