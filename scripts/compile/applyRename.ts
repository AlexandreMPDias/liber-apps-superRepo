import * as types from "./types";
import { BASE_OPTIONS } from "./constants";

const applyVarRename = (
	value: string,
	options: types.IOptions = BASE_OPTIONS
) => {
	const renames = options.args;
	let output = value;
	renames.forEach((ren, index) => {
		output = output.replace(new RegExp(`\\$${index + 1}`, "g"), ren);
	});
	return output;
};

const applyKeyRename = (
	base: string,
	name: string,
	options: types.IOptions = BASE_OPTIONS
) => {
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

export default {
	value: applyVarRename,
	key: applyKeyRename,
};
