export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string =>
  objectToString.call(value);

export const toRawType = (value: unknown): string =>
  toTypeString(value).slice(8, -1);

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object';
