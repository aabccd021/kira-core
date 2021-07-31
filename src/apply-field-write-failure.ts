import { Field, WriteField } from './data';

export type ApplyFieldWriteFailure = {
  readonly _failureType: 'ApplyWrite';
  readonly expectedFieldTypes: readonly (Field['_type'] | WriteField['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export const ApplyFieldWriteFailure: (
  p: Omit<ApplyFieldWriteFailure, '_failureType'>
) => ApplyFieldWriteFailure = (p) => ({
  ...p,
  _failureType: 'ApplyWrite',
});
