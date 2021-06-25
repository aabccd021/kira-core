import { Dictionary } from './util';

export type Field =
  | CountField
  | CreationTimeField
  | ImageField
  | OwnerField
  | RefField
  | StringField;

export type CountField = {
  readonly type: 'count';
  readonly countedCol: string;
  readonly groupByRef: string;
};

export type CreationTimeField = {
  readonly type: 'creationTime';
};

export type ImageField = {
  readonly type: 'image';
};

export type OwnerField = {
  readonly type: 'owner';
  readonly userCol: string;
  readonly syncFields: Dictionary<RefField | true>;
};

export type RefField = {
  readonly type: 'ref';
  readonly refCol: string;
  readonly syncFields: Dictionary<RefField | true>;
};

export type StringField = {
  readonly type: 'string';
};
