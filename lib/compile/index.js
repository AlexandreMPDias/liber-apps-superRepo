"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io_1 = __importDefault(require("./io"));
const extractScripts_1 = __importDefault(require("./extractScripts"));
const sortKeys_1 = __importDefault(require("./sortKeys"));
const main = () => {
    const { packageJson, source } = io_1.default.init();
    const parsedScripts = {};
    extractScripts_1.default(source.content, parsedScripts);
    packageJson.content.scripts = sortKeys_1.default(parsedScripts);
    packageJson.update();
};
main();
exports.default = {};
