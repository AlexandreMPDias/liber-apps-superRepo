const entries = <T extends object>(object: T): Array<[keyof T, T[keyof T]]> => {
	return Object.entries(object) as any;
};

const keys = <T extends object>(object: T): Array<keyof T> => {
	return Object.keys(object) as any;
};

export default {
	entries,
	keys,
};
