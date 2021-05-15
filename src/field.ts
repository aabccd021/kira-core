import { Dictionary } from './util';

export type StringField = {
  readonly type: 'string';
};

export type CountField = {
  readonly type: 'count';
  readonly countedCol: string;
  readonly groupByRef: string;
};

export type ImageField = {
  readonly type: 'image';
};

export type CreationTimeField = {
  readonly type: 'creationTime';
};

export type OwnerField = {
  readonly type: 'owner';
  readonly syncFields?: Dictionary<true>;
};

export type RefField = {
  readonly type: 'ref';
  readonly refCol: string;
  readonly syncFields?: Dictionary<true>;
};
