import * as types from "./types";

interface ICleanSpecialKeys {
	forEach: types.ISourceSpecialKeys["$forEach"];
}

function extractDolars(source: types.Source): ICleanSpecialKeys {
	const dolars: any = {};
	Object.keys(source).forEach((key) => {
		if (key.match(/^\$/)) {
			dolars[key.replace(/^\$/, "")] = source[key];
			delete source[key];
		}
	});
	return dolars;
}

export default extractDolars;
