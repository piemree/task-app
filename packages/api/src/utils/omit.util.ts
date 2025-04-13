export function omit<T, K extends keyof T>(obj: T, keys: K[] | K): Omit<T, K> {
	const keysArray = Array.isArray(keys) ? keys : [keys];
	const result = { ...obj };

	for (const key of keysArray) {
		delete result[key];
	}

	return result;
}
