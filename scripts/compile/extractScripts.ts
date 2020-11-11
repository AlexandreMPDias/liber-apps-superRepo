import * as types from "./types";
import { BASE_OPTIONS, REGEXES } from "./constants";
import extractDolars from "./extractDolar";
import applyRename from "./applyRename";
import Object from "./Object";

const updateOutput = (
	source: types.Source,
	output: types.Scripts,
	base: string = "",
	options: types.IOptions = BASE_OPTIONS
): void => {
	if (!source) {
		return;
	}
	Object.entries(source).forEach(([innerKey, value]) => {
		const key = applyRename.key(base, innerKey, options);
		if (typeof value === "string") {
			output[key] = applyRename.value(value, options);
		} else if (typeof value === "object") {
			extractScripts(value, output, key, options);
		}
	});
};

function extractScripts(
	source: types.Source,
	output: types.Scripts,
	base: string = "",
	options: types.IOptions = BASE_OPTIONS
) {
	const { forEach } = extractDolars(source);
	if (forEach) {
		forEach.forEach(({ $in, $scripts, $key = "$1" }) => {
			$in.forEach((args) => {
				const nextOptions = { ...options, args };
				if ($key.match(REGEXES.keyMethodRename)) {
					nextOptions.flags = {
						...options.flags,
						$key_name: true,
					};
				}
				const eachSrc: any = { [$key]: $scripts };
				updateOutput(eachSrc, output, base, nextOptions);
			});
		});
	}
	updateOutput(source, output, base, options);
}

export default extractScripts;
