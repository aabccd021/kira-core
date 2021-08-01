import { Dict } from 'trimop';

export type SchemaSyncedFields = Dict<SchemaSyncedFields | true>;

export type CountSchemaField = {
  readonly countedCol: string;
  readonly groupByRef: string;
  readonly type: 'Count';
};

export type CreationTimeSchemaField = {
  readonly type: 'CreationTime';
};

export type ImageSchemaField = {
  readonly type: 'Image';
};

export type OwnerSchemaField = {
  readonly syncFields?: Dict<true>;
  readonly type: 'owner';
};

export type RefSchemaField = {
  readonly refedCol: string;
  readonly syncFields?: SchemaSyncedFields;
  readonly type: 'Ref';
};

export type StringSchemaField = {
  readonly type: 'String';
};

export type SchemaField =
  | CountSchemaField
  | CreationTimeSchemaField
  | ImageSchemaField
  | OwnerSchemaField
  | RefSchemaField
  | StringSchemaField;
