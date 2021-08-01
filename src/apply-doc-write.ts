import { Either, Failed, foldRight, ShouldBeUnreachableFailure, Value } from 'trimop';

import { DateField, Doc, Field, NumberField, RefField, WriteDoc, WriteField } from './data';
import { InvalidFieldTypeFailure } from './invalid-field-type-failure';

export type ApplyDocWriteFailure = InvalidFieldTypeFailure | ShouldBeUnreachableFailure;

export function applyFieldWrite({
  field,
  writeField,
}: {
  readonly field: Field | undefined;
  readonly writeField: WriteField;
}): Either<ApplyDocWriteFailure, Field> {
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
    if (field === undefined || field._type === 'number') {
      return Value(NumberField((field !== undefined ? field.value : 0) + writeField.value));
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'ref') {
    if (field === undefined) {
      return foldRight(
        // eslint-disable-next-line no-use-before-define
        applyDocWrite({ doc: {}, writeDoc: writeField.snapshot.doc }),
        (newDoc) =>
          Value(
            RefField({
              doc: newDoc,
              id: writeField.snapshot.id,
            })
          )
      );
    }
    if (field._type === 'ref') {
      return foldRight(
        // eslint-disable-next-line no-use-before-define
        applyDocWrite({ doc: field.snapshot.doc, writeDoc: writeField.snapshot.doc }),
        (newDoc) =>
          Value(
            RefField({
              doc: newDoc,
              id: writeField.snapshot.id,
            })
          )
      );
    }

    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['ref'],
        field,
      })
    );
  }
  return Failed(ShouldBeUnreachableFailure(writeField));
}

export function applyDocWrite({
  doc,
  writeDoc,
}: {
  readonly doc: Doc | undefined;
  readonly writeDoc: WriteDoc;
}): Either<ApplyDocWriteFailure, Doc> {
  return Object.entries(writeDoc).reduce<Either<ApplyDocWriteFailure, Doc>>(
    (acc, [fieldName, writeField]) =>
      foldRight(acc, (acc) =>
        foldRight(applyFieldWrite({ field: doc?.[fieldName], writeField }), (field) =>
          Value({ ...acc, [fieldName]: field })
        )
      ),
    Value(doc ?? {})
  );
}
