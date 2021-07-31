import { Field, WriteField } from '../data';

export type ApplyWriteDocFailure = {
  readonly _failureType: 'ApplyWrite';
  readonly expectedFieldTypes: readonly (Field['_type'] | WriteField['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export const ApplyWriteDocFailure: (
  p: Omit<ApplyWriteDocFailure, '_failureType'>
) => ApplyWriteDocFailure = (p) => ({
  ...p,
  _failureType: 'ApplyWrite',
});
