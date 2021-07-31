import { Either, Failed, foldRight, ShouldBeUnreachableFailure, Value } from 'trimop';

import { Doc, Field, RefWriteField, WriteDoc, WriteField } from './data';

/**
 * ToWriteField
 */

export function toWriteField(field: Field): Either<ShouldBeUnreachableFailure, WriteField> {
  if (field._type === 'ref') {
    // eslint-disable-next-line no-use-before-define
    return foldRight(toWriteDoc(field.value.data), (writeDoc) => Value(RefWriteField(writeDoc)));
  }
  if (
    field._type === 'date' ||
    field._type === 'number' ||
    field._type === 'string' ||
    field._type === 'stringArray' ||
    field._type === 'image'
  ) {
    return Value(field);
  }
  return Failed(ShouldBeUnreachableFailure(field));
}

export function toWriteDoc(doc: Doc): Either<ShouldBeUnreachableFailure, WriteDoc> {
  return Object.entries(doc).reduce<Either<ShouldBeUnreachableFailure, WriteDoc>>(
    (acc, [fieldName, field]) =>
      foldRight(acc, (acc) =>
        foldRight(toWriteField(field), (writeField) => Value({ ...acc, [fieldName]: writeField }))
      ),
    Value({})
  );
}
