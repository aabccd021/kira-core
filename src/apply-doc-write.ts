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
  if (writeField._type === 'String') {
    if (field === undefined || field._type === 'String') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['String', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Number') {
    if (field === undefined || field._type === 'Number') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['Number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Image') {
    if (field === undefined || field._type === 'Image') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['Image', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Date') {
    if (field === undefined || field._type === 'Date') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['Date', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Ref') {
    if (field === undefined || field._type === 'Ref') {
      return Value(writeField);
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['Ref', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'CreationTime') {
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
  if (writeField._type === 'Increment') {
    if (field === undefined || field._type === 'Number') {
      return Value(NumberField((field !== undefined ? field.value : 0) + writeField.value));
    }
    return Failed(
      InvalidFieldTypeFailure({
        expectedFieldTypes: ['Number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'RefUpdate') {
    if (field?._type === 'Ref') {
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
        expectedFieldTypes: ['Ref'],
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
