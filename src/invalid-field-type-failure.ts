import { Field } from './data';

/**
 * InvalidFieldTypeFailure
 */
export type InvalidFieldTypeFailure = {
  readonly _failureType: 'InvalidFieldType';
  readonly expectedFieldTypes: readonly (Field['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export const InvalidFieldTypeFailure: (
  p: Omit<InvalidFieldTypeFailure, '_failureType'>
) => InvalidFieldTypeFailure = (p) => ({
  ...p,
  _failureType: 'InvalidFieldType',
});
