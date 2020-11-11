"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = __importDefault(require("./Object"));
const HEADER_KEY = ".___header";
const headerValue = (value) => {
    const capitalize = value.charAt(0).toUpperCase() + value.slice(1);
    return `echo ---- ${capitalize}  Scripts -----`;
};
const headerKey = (key) => {
    return `${"-".repeat(4)} ${key.replace(HEADER_KEY, "")} ${"-".repeat(10)}`;
};
function sortKeys(scripts) {
    const namespaces = [];
    const keys = {};
    const ungrouped = {};
    Object_1.default.keys(scripts).forEach((key) => {
        if (key.match(/\./)) {
            const target = key.split(".")[1];
            if (!namespaces.includes(target)) {
                keys[target + HEADER_KEY] = headerValue(target);
            }
            keys[target + "." + key] = key;
        }
        else {
            ungrouped[key] = true;
            keys[key] = key;
        }
    });
    const output = {};
    Object_1.default.keys(keys)
        .sort()
        .map((target) => {
        const key = keys[target];
        if (key in ungrouped) {
            return target;
        }
        if (key in scripts) {
            output[key] = scripts[key].replace(/\$\$/g, "$");
            return null;
        }
        else {
            output[headerKey(target)] = key;
            return null;
        }
    })
        .filter((x) => x)
        .forEach((target, index) => {
        const key = keys[target];
        if (index === 0) {
            output[headerKey("utils")] = headerValue("utils");
        }
        output[key] = scripts[key];
    });
    return output;
}
exports.default = sortKeys;
