import { Either, Failed, Failure, foldRight, ShouldBeUnreachableFailure, Value } from 'trimop';

import { DateField, Doc, Field, NumberField, RefField, WriteDoc, WriteField } from './data';

/**
 * ApplyWriteFailure
 */
export type ApplyWriteFailure = {
  readonly _failureType: 'ApplyWrite';
  readonly expectedFieldTypes: readonly (Field['_type'] | WriteField['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export const ApplyWriteFailure: (p: Omit<ApplyWriteFailure, '_failureType'>) => ApplyWriteFailure =
  (p) => ({
    ...p,
    _failureType: 'ApplyWrite',
  });

export function applyFieldWrite({
  oldField,
  writeField,
}: {
  readonly oldField: Field | undefined;
  readonly writeField: WriteField;
}): Either<Failure, Field | undefined> {
  if (writeField._type === 'string') {
    return Value(writeField);
  }
  if (writeField._type === 'number') {
    return Value(writeField);
  }
  if (writeField._type === 'image') {
    return Value(writeField);
  }
  if (writeField._type === 'date') {
    return Value(writeField);
  }
  if (writeField._type === 'creationTime') {
    return Value(DateField(new Date()));
  }
  if (writeField._type === 'increment') {
    if (oldField === undefined || oldField._type === 'number') {
      return Value(NumberField(oldField !== undefined ? oldField.value : 0 + writeField.value));
    }
    return Failed(
      ApplyWriteFailure({
        expectedFieldTypes: ['number', 'undefined'],
        field: oldField,
      })
    );
  }
  if (writeField._type === 'ref') {
    if (oldField?._type !== 'ref') {
      return Failed(
        ApplyWriteFailure({
          expectedFieldTypes: ['ref'],
          field: oldField,
        })
      );
    }

    return foldRight(
      // eslint-disable-next-line no-use-before-define
      applyDocWrite({ oldDoc: oldField.value.data, writeDoc: writeField.value.data }),
      (newDoc) =>
        Value(
          RefField({
            data: newDoc,
            id: oldField.value.id,
          })
        )
    );
  }
  return Failed(ShouldBeUnreachableFailure(writeField));
}

export function applyDocWrite({
  oldDoc,
  writeDoc,
}: {
  readonly oldDoc: Doc | undefined;
  readonly writeDoc: WriteDoc;
}): Either<Failure, Doc> {
  return Object.entries(writeDoc).reduce<Either<Failure, Doc>>(
    (acc, [fieldName, writeField]) =>
      foldRight(acc, (acc) =>
        foldRight(applyFieldWrite({ oldField: oldDoc?.[fieldName], writeField }), (field) =>
          Value(field === undefined ? acc : { ...acc, [fieldName]: field })
        )
      ),
    Value(oldDoc ?? {})
  );
}
