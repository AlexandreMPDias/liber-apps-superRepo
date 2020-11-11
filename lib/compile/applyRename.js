"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const applyVarRename = (value, options = constants_1.BASE_OPTIONS) => {
    const renames = options.args;
    let output = value;
    renames.forEach((ren, index) => {
        output = output.replace(new RegExp(`\\$${index + 1}`, "g"), ren);
    });
    return output;
};
const applyKeyRename = (base, name, options = constants_1.BASE_OPTIONS) => {
    const value = [base, name].filter((x) => x).join(".");
    let output = applyVarRename(value, options);
    if (options.flags.$key_name) {
        if (output.endsWith(name)) {
            output = output
                .slice(0, output.length - name.length)
                .replace(/\.$/, "");
            output = output.replace("{name}", name);
        }
    }
    output = output.replace(/\.$/, "").replace(/^\./, "");
    return output;
};
exports.default = {
    value: applyVarRename,
    key: applyKeyRename,
};
