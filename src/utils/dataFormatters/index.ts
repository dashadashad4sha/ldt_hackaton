import { camelCase, isArray, isObject, snakeCase, transform } from 'lodash';

const camelize = <T extends object>(obj: T) =>
    transform(obj, (acc, value, key, target) => {
        const camelKey = isArray(target) ? key : camelCase(key.toString());

        // @ts-ignore
        acc[camelKey] = isObject(value) ? this.camelize(value) : value;
    }) as T
	
const snakeize = (obj: any): any =>
	transform(obj, (acc, value, key, target) => {
		const camelKey = isArray(target) ? key : snakeCase(key.toString());

		// @ts-ignore
	acc[camelKey] = isObject(value) ? this.snakeize(value) : value;
});

const dataFormatters = {
	camelize,
	snakeize,
}

export default dataFormatters;