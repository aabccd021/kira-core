import { ImageFieldValue } from '../src';
import { isImageFieldValue } from '../src/is-image-field';

describe('isImageFieldValue', () => {
  it('returns true if given imageFieldValue', () => {
    const field: ImageFieldValue = { url: 'some_url' };
    expect(isImageFieldValue(field)).toEqual(true);
  });

  it('returns false if given non object', () => {
    expect(isImageFieldValue('some_url')).toEqual(false);
  });

  it('returns false if given field more than url', () => {
    expect(isImageFieldValue({ foo: 'bar', url: 'some_url' })).toEqual(false);
  });
});
