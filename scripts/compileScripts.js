const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const read = (file) => JSON.parse(readFileSync(file, { encoding: 'utf-8' }));
const write = (file, content) => writeFileSync(file, JSON.stringify(content, null, "\t"), { encoding: 'utf-8' });

const regexes = {
	keyMethodRename: /\{name\}/
}

/**
 * @type {{
 * 	args: string[];
 * 	flags: {
 * 		$key_name: boolean;
 * 	}
 * }}
 */
const _dftOption = { flags: {}, args: []};

const applyVarRename = (value, options = _dftOption) => {
	const renames = options.args;
	let output = value;
	renames.forEach((ren, index) => {
		output = output.replace(new RegExp(`\\$${index + 1}`, 'g'), ren);
	})
	return output;
}

const applyKeyRename = (base, name, options = _dftOption) => {
	const value = [base, name].filter(x => x).join('.')
	let output = applyVarRename(value, options);

	if(options.flags.$key_name) {
		if(output.endsWith(name)) {
			output = output.slice(0, output.length - name.length).replace(/\.$/,'');
			output = output.replace('{name}', name);
		}
	}

	output = output.replace(/\.$/,'').replace(/^\./,'');

	return output;
}

function extractDolars(source) {
	const dolars = {};
	Object.keys(source).forEach(key => {
		if (key.match(/^\$/)) {
			dolars[key.replace(/^\$/, '')] = source[key]
			delete source[key]
		}
	});
	return dolars;
}

function updateOutput(source, output, base = '', options = _dftOption) {
	if (!source) {
		return;
	}
	Object.entries(source).forEach(([innerKey, value]) => {
		const key = applyKeyRename(base, innerKey, options);
		if (typeof value === 'string') {
			output[key] = applyVarRename(value, options);
		} else if (typeof value === 'object') {
			extractScripts(value, output, key, options);
		}
	})
}

function extractScripts(source, output, base = '', options = _dftOption) {
	const { forEach } = extractDolars(source);
	if (forEach) {
		forEach.forEach(({$in, $scripts, $key = '$1'}) => {
			$in.forEach(args => {
				const nextOptions = {...options, args};
				if($key.match(regexes.keyMethodRename)) {
					nextOptions.flags = {
						...options.flags,
						$key_name: true
					}
				}
				const eachSrc = { [$key]: $scripts };
				updateOutput(eachSrc, output, base, nextOptions)

			})
		})
	}
	updateOutput(source, output, base, options);
}

function sortKeys(scripts) {
	const HEADER_KEY = '.___header';
	const namespaces = [];
	const keys = {};
	Object.keys(scripts).forEach(key => {
		if(key.match(/\./)) {
			const target = key.split('.')[1];
			if(!namespaces.includes(target)) {
				const capitalize = target.charAt(0).toUpperCase() + target.slice(1);
				keys[target+HEADER_KEY] = `echo ---- ${capitalize}  Scripts -----`;
			}
			keys[target+'.'+key] = key; 
		} else {
			keys[key] = key;
		}
	});
	const output = {};
	Object.keys(keys).sort().forEach(target => {
		const key = keys[target];
		if(key in scripts) {
			output[key] = scripts[key].replace(/\$\$/g, '$');
		} else {
			const cleanHeader = `${'-'.repeat(4)} ${target.replace(HEADER_KEY, '')} ${'-'.repeat(10)}`;
			output[cleanHeader] = key;
		}
	})
	return output;
}

const main = () => {
	const [sourceFile, possibleTargetPkgJson] = process.argv.slice(2);
	const packageJsonPath = possibleTargetPkgJson || path.join(path.dirname(sourceFile), 'package.json');

	const scripts = read(sourceFile);
	const packageJson = read(packageJsonPath);

	const output = {};

	extractScripts(scripts, output);


	packageJson.scripts = sortKeys(output);
	write(packageJsonPath, packageJson)

}

main();