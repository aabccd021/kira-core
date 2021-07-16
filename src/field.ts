import { Dictionary } from './util';

export type SyncFields = Dictionary<SyncFields | true>;

export type ThisColRefer = {
  readonly colName: string;
  readonly fields: readonly {
    readonly name: string;
    readonly syncFields: SyncFields;
  }[];
  readonly thisColRefers: readonly ThisColRefer[];
};

export type Field = CountField | CreationTimeField | ImageField | RefField | StringField;

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

export type RefField = {
  readonly type: 'ref';
  readonly isOwner: boolean;
  readonly refedCol: string;
  readonly syncFields: SyncFields;
  readonly thisColRefers: readonly ThisColRefer[];
};

export type StringField = {
  readonly type: 'string';
};
