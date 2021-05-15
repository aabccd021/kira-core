import {
  CountField,
  CreationTimeField,
  ImageField,
  OwnerField,
  RefField,
  StringField,
} from './field';

export type Dictionary<T> = Record<string, T>;

export const VERSION = ['0.3.3'] as const;
type Version = typeof VERSION[number];

// 1
export type Field_1 =
  | CountField
  | CreationTimeField
  | ImageField
  | OwnerField
  | RefField
  | StringField;

export type Schema_1 = {
  readonly version: Version;
  readonly userCol: string;
  readonly cols: Dictionary<Dictionary<Field_1>>;
};

// 2
export type Field_2 = CountField | CreationTimeField | ImageField | RefField | StringField;

export type Schema_2 = {
  readonly version: Version;
  readonly cols: Dictionary<Dictionary<Field_2>>;
};

// 3
export type Field_3 = CountField | CreationTimeField | OwnerField | RefField | StringField;

export type Schema_3 = {
  readonly version: Version;
  readonly userCol: string;
  readonly cols: Dictionary<Dictionary<Field_3>>;
};

// 4
export type Field_4 = CountField | CreationTimeField | RefField | StringField;

export type Schema_4 = {
  readonly version: Version;
  readonly cols: Dictionary<Dictionary<Field_4>>;
};
