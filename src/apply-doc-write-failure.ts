import { Field, WriteField } from './data';

export type ApplyDocWriteFailure = {
  readonly _failureType: 'ApplyWrite';
  readonly expectedFieldTypes: readonly (Field['_type'] | WriteField['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export const ApplyDocWriteFailure: (
  p: Omit<ApplyDocWriteFailure, '_failureType'>
) => ApplyDocWriteFailure = (p) => ({
  ...p,
  _failureType: 'ApplyWrite',
});
