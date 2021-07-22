import { Dictionary } from './util';

export type SyncedFields = Dictionary<SyncedFields | true>;

export type ColRefer = {
  readonly colName: string;
  readonly fields: readonly {
    readonly name: string;
    readonly syncedFields: SyncedFields;
  }[];
  readonly thisColRefers: readonly ColRefer[];
};

export type Spec = Dictionary<Dictionary<FieldSpec>>;

export type FieldSpec =
  | CountFieldSpec
  | CreationTimeFieldSpec
  | ImageFieldSpec
  | RefFieldSpec
  | StringFieldSpec;

export type CountFieldSpec = {
  readonly _type: 'count';
  readonly countedCol: string;
  readonly groupByRef: string;
};

export type CreationTimeFieldSpec = {
  readonly _type: 'creationTime';
};

export type ImageFieldSpec = {
  readonly _type: 'image';
};

export type RefFieldSpec = {
  readonly _type: 'ref';
  readonly isOwner: boolean;
  readonly refedCol: string;
  readonly syncedFields: SyncedFields;
  readonly thisColRefers: readonly ColRefer[];
};

export type StringFieldSpec = {
  readonly _type: 'string';
};
