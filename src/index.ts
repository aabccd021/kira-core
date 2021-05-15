import { Schema } from './schema';
import { Dictionary } from './util';

type EntryOf<T> = T extends Dictionary<infer R> ? R : never;

export * from './field';
export * from './schema';
export { Dictionary } from './util';

export type FieldOf<S extends Schema> = EntryOf<EntryOf<S['cols']>>;
