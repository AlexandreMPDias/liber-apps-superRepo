import * as types from "./types";
import Object from "./Object";

const HEADER_KEY = ".___header";

const headerValue = (value: string) => {
	const capitalize = value.charAt(0).toUpperCase() + value.slice(1);
	return `echo ---- ${capitalize}  Scripts -----`;
};

const headerKey = (key: string) => {
	return `${"-".repeat(4)} ${key.replace(HEADER_KEY, "")} ${"-".repeat(10)}`;
};

function sortKeys(scripts: types.Scripts): types.Scripts {
	const namespaces = [];
	const keys: Record<string, string> = {};

	const ungrouped = {};

	Object.keys(scripts).forEach((key) => {
		if (key.match(/\./)) {
			const target = key.split(".")[1];
			if (!namespaces.includes(target)) {
				keys[target + HEADER_KEY] = headerValue(target);
			}
			keys[target + "." + key] = key;
		} else {
			ungrouped[key] = true;
			keys[key] = key;
		}
	});
	const output: any = {};
	Object.keys(keys)
		.sort()
		.map((target) => {
			const key = keys[target];
			if (key in ungrouped) {
				return target;
			}
			if (key in scripts) {
				output[key] = scripts[key].replace(/\$\$/g, "$");
				return null;
			} else {
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

export default sortKeys;
