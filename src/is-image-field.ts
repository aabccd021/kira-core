import { ImageFieldValue } from './data';

export function isImageFieldValue(field: unknown): field is ImageFieldValue {
  const imageFieldValue = field as ImageFieldValue;
  return (
    typeof imageFieldValue === 'object' &&
    Object.keys(imageFieldValue).length === 1 &&
    typeof imageFieldValue.url === 'string'
  );
}
