import { Either, Failed, foldValue, ShouldBeUnreachableFailure, Value } from 'trimop';

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
    if (field === undefined || field._type === 'string') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['string', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'number') {
    if (field === undefined || field._type === 'number') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'image') {
    if (field === undefined || field._type === 'image') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['image', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'date') {
    if (field === undefined || field._type === 'date') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['date', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'ref') {
    if (field === undefined || field._type === 'ref') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['ref', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'creationTime') {
    if (field === undefined) {
      return Value(DateField(new Date()));
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['undefined'],
        field,
      })
    );
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
  if (writeField._type === 'refUpdate') {
    if (field?._type === 'ref') {
      return foldValue(
        // eslint-disable-next-line no-use-before-define
        applyDocWrite({ doc: field.snapshot.doc, writeDoc: writeField.doc }),
        (newDoc) =>
          Value(
            RefField({
              doc: newDoc,
              id: field.snapshot.id,
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
      foldValue(acc, (acc) =>
        foldValue(applyFieldWrite({ field: doc?.[fieldName], writeField }), (field) =>
          Value({ ...acc, [fieldName]: field })
        )
      ),
    Value(doc ?? {})
  );
}
