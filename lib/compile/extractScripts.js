"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const extractDolar_1 = __importDefault(require("./extractDolar"));
const applyRename_1 = __importDefault(require("./applyRename"));
const Object_1 = __importDefault(require("./Object"));
const updateOutput = (source, output, base = "", options = constants_1.BASE_OPTIONS) => {
    if (!source) {
        return;
    }
    Object_1.default.entries(source).forEach(([innerKey, value]) => {
        const key = applyRename_1.default.key(base, innerKey, options);
        if (typeof value === "string") {
            output[key] = applyRename_1.default.value(value, options);
        }
        else if (typeof value === "object") {
            extractScripts(value, output, key, options);
        }
    });
};
function extractScripts(source, output, base = "", options = constants_1.BASE_OPTIONS) {
    const { forEach } = extractDolar_1.default(source);
    if (forEach) {
        forEach.forEach(({ $in, $scripts, $key = "$1" }) => {
            $in.forEach((args) => {
                const nextOptions = Object.assign(Object.assign({}, options), { args });
                if ($key.match(constants_1.REGEXES.keyMethodRename)) {
                    nextOptions.flags = Object.assign(Object.assign({}, options.flags), { $key_name: true });
                }
                const eachSrc = { [$key]: $scripts };
                updateOutput(eachSrc, output, base, nextOptions);
            });
        });
    }
    updateOutput(source, output, base, options);
}
exports.default = extractScripts;
