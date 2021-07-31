import { Dict } from 'trimop';

export type SchemaSyncedFields = Dict<SchemaSyncedFields | true>;

export type CountSchemaField = {
  readonly countedCol: string;
  readonly groupByRef: string;
  readonly type: 'count';
};

export type CreationTimeSchemaField = {
  readonly type: 'creationTime';
};

export type ImageSchemaField = {
  readonly type: 'image';
};

export type OwnerSchemaField = {
  readonly syncFields?: Dict<true>;
  readonly type: 'owner';
};

export type RefSchemaField = {
  readonly refedCol: string;
  readonly syncFields?: SchemaSyncedFields;
  readonly type: 'ref';
};

export type StringSchemaField = {
  readonly type: 'string';
};

export type SchemaField =
  | CountSchemaField
  | CreationTimeSchemaField
  | ImageSchemaField
  | OwnerSchemaField
  | RefSchemaField
  | StringSchemaField;
