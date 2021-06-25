import { Dictionary, Version } from './util';

export type Schema = {
  readonly version: Version;
  readonly userCol?: string;
  readonly cols: Dictionary<Dictionary<SchemaField>>;
};

export type SchemaField =
  | CountSchemaField
  | CreationTimeSchemaField
  | ImageSchemaField
  | OwnerSchemaField
  | RefSchemaField
  | StringSchemaField;

export type CountSchemaField = {
  readonly type: 'count';
  readonly countedCol: string;
  readonly groupByRef: string;
};

export type CreationTimeSchemaField = {
  readonly type: 'creationTime';
};

export type ImageSchemaField = {
  readonly type: 'image';
};

export type OwnerSchemaField = {
  readonly type: 'owner';
  readonly syncFields?: Dictionary<true>;
};

export type RefSchemaField = {
  readonly type: 'ref';
  readonly refCol: string;
  readonly syncFields?: Dictionary<true>;
};

export type StringSchemaField = {
  readonly type: 'string';
};
