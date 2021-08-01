import { Dict } from 'trimop';

export type SyncedFields = Dict<SyncedFields | true>;

export type ColRefer = {
  readonly colName: string;
  readonly fields: readonly {
    readonly name: string;
    readonly syncedFields: SyncedFields;
  }[];
  readonly thisColRefers: readonly ColRefer[];
};

export type CreationTimeFieldSpec = {
  readonly _type: 'CreationTime';
};

export type ImageFieldSpec = {
  readonly _type: 'Image';
};

export type RefFieldSpec = {
  readonly _type: 'Ref';
  readonly isOwner: boolean;
  readonly refedCol: string;
  readonly syncedFields: SyncedFields;
  readonly thisColRefers: readonly ColRefer[];
};

export type StringFieldSpec = {
  readonly _type: 'String';
};

export type FieldSpec = CreationTimeFieldSpec | ImageFieldSpec | RefFieldSpec | StringFieldSpec;

export type Spec = Dict<Dict<FieldSpec>>;
