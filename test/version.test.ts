import { readFileSync } from 'fs';

import { VERSION } from '../src/schema';

describe('schema type version', () => {
  it('has same version as package', () => {
    const packageVersion = JSON.parse(readFileSync('package.json', 'utf-8'))?.version;
    expect(VERSION).toHaveLength(1);
    expect(VERSION[0]).toEqual(packageVersion);
  });
});
