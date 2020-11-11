export interface IOptions {
	args: string[];
	flags: {
		$key_name?: boolean;
	};
}

export type Scripts<V = string> = Record<string, string | V>;

export interface IForEach {
	$key?: string;
	$in: string[][];
	$scripts: Source;
}

export interface ISourceSpecialKeys {
	$forEach?: IForEach[];
}

export type Source = ISourceSpecialKeys & Scripts;
