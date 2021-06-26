import { ThisColReferFields } from './field-types';
import { Dictionary } from './util';

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
  readonly syncFields: Dictionary<RefField | true>;
  readonly thisColReferFields: ThisColReferFields;
};

export type StringField = {
  readonly type: 'string';
};
