"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractDolars(source) {
    const dolars = {};
    Object.keys(source).forEach((key) => {
        if (key.match(/^\$/)) {
            dolars[key.replace(/^\$/, "")] = source[key];
            delete source[key];
        }
    });
    return dolars;
}
exports.default = extractDolars;
