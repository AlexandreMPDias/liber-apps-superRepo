import io from "./io";
import * as types from "./types";
import extractScripts from "./extractScripts";
import sortKeys from "./sortKeys";

const main = () => {
	const { packageJson, source } = io.init();

	const parsedScripts: types.Scripts = {};
	extractScripts(source.content, parsedScripts);

	packageJson.content.scripts = sortKeys(parsedScripts);

	packageJson.update();
};

main();

export default {};
