import {
  Either,
  eitherArrayReduce,
  eitherMapRight,
  Left,
  None,
  Option,
  optionFold,
  optionFromNullable,
  Right,
  Some,
} from 'trimop';

import { DateField, Doc, Field, NumberField, RefField, WriteDoc, WriteField } from './data';

/**
 * ApplyDocWriteError
 */
export type ApplyDocWriteError = {
  readonly field: Option<Field>;
};

export function ApplyDocWriteError(field: Option<Field>): ApplyDocWriteError {
  return { field };
}

/**
 *
 * @param param0
 * @returns
 */
export function applyFieldWrite({
  field,
  writeField,
}: {
  readonly field: Option<Field>;
  readonly writeField: WriteField;
}): Either<ApplyDocWriteError, Field> {
  if (writeField._type === 'String') {
    return optionFold(
      field,
      () => Right(writeField),
      (field) =>
        field._type === 'String' ? Right(writeField) : Left(ApplyDocWriteError(Some(field)))
    );
  }
  if (writeField._type === 'Number') {
    return optionFold(
      field,
      () => Right(writeField),
      (field) =>
        field._type === 'Number' ? Right(writeField) : Left(ApplyDocWriteError(Some(field)))
    );
  }
  if (writeField._type === 'Image') {
    return optionFold(
      field,
      () => Right(writeField),
      (field) =>
        field._type === 'Image' ? Right(writeField) : Left(ApplyDocWriteError(Some(field)))
    );
  }
  if (writeField._type === 'Date') {
    return optionFold(
      field,
      () => Right(writeField),
      (field) =>
        field._type === 'Date' ? Right(writeField) : Left(ApplyDocWriteError(Some(field)))
    );
  }
  if (writeField._type === 'Ref') {
    return optionFold(
      field,
      () => Right(writeField),
      (field) => (field._type === 'Ref' ? Right(writeField) : Left(ApplyDocWriteError(Some(field))))
    );
  }
  if (writeField._type === 'CreationTime') {
    return optionFold<Either<ApplyDocWriteError, Field>, Field>(
      field,
      () => Right(DateField(new Date())),
      (field) => Left(ApplyDocWriteError(Some(field)))
    );
  }
  if (writeField._type === 'Increment') {
    return optionFold(
      field,
      () => Right(NumberField(writeField.value)),
      (field) =>
        field._type === 'Number'
          ? Right(NumberField(field.value + writeField.value))
          : Left(ApplyDocWriteError(Some(field)))
    );
  }

  // writeField._type === 'RefUpdate'
  return optionFold(
    field,
    () => Left(ApplyDocWriteError(None())),
    (field) => {
      return field._type !== 'Ref'
        ? Left(ApplyDocWriteError(Some(field)))
        : eitherMapRight(
            // eslint-disable-next-line no-use-before-define
            applyDocWrite({ doc: Some(field.snapshot.doc), writeDoc: writeField.doc }),
            (newDoc) =>
              Right(
                RefField({
                  doc: newDoc,
                  id: field.snapshot.id,
                })
              )
          );
    }
  );
}

export function applyDocWrite({
  doc,
  writeDoc,
}: {
  readonly doc: Option<Doc>;
  readonly writeDoc: WriteDoc;
}): Either<ApplyDocWriteError, Doc> {
  const docc = optionFold(
    doc,
    () => ({}),
    (value) => value
  );
  return eitherArrayReduce(Object.entries(writeDoc), Right(docc), (acc, [fieldName, writeField]) =>
    eitherMapRight(
      applyFieldWrite({ field: optionFromNullable<Field>(docc[fieldName]), writeField }),
      (field) => Right({ ...acc, [fieldName]: field })
    )
  );
}
