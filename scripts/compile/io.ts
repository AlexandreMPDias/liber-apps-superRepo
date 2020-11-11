import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import * as types from "./types";

interface PackageJSONStructure {
	[key: string]: PackageJSONStructure | string;
}
const read = (file: string) =>
	JSON.parse(readFileSync(file, { encoding: "utf-8" }));
const write = (file: string, content: object) =>
	writeFileSync(file, JSON.stringify(content, null, "\t"), {
		encoding: "utf-8",
	});

export class File<T extends object> {
	public content: T;
	private path: string;

	constructor(p: string) {
		this.path = p;
		this.content = read(this.path);
	}

	public update = () => {
		write(this.path, this.content);
	};
}

const init = () => {
	const [sourceFile, possibleTargetPkgJson] = process.argv.slice(2);
	const packageJsonPath =
		possibleTargetPkgJson ||
		path.join(path.dirname(sourceFile), "package.json");

	const source = new File<types.Source>(sourceFile);
	const packageJson = new File<PackageJSONStructure>(packageJsonPath);

	return {
		source,
		packageJson,
	};
};

export default { init };
