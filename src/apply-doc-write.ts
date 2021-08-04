import { Either, eitherMapRight, left, right } from 'trimop';

import { DateField, Doc, Field, NumberField, RefField, WriteDoc, WriteField } from './data';

/**
 * ApplyDocWriteError
 */
export type ApplyDocWriteError = {
  readonly expectedFieldTypes: readonly (Field['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export function applyDocWriteError(p: ApplyDocWriteError): ApplyDocWriteError {
  return {
    ...p,
  };
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
  readonly field: Field | undefined;
  readonly writeField: WriteField;
}): Either<ApplyDocWriteError, Field> {
  if (writeField._type === 'String') {
    if (field === undefined || field._type === 'String') {
      return right(writeField);
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['String', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Number') {
    if (field === undefined || field._type === 'Number') {
      return right(writeField);
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['Number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Image') {
    if (field === undefined || field._type === 'Image') {
      return right(writeField);
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['Image', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Date') {
    if (field === undefined || field._type === 'Date') {
      return right(writeField);
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['Date', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Ref') {
    if (field === undefined || field._type === 'Ref') {
      return right(writeField);
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['Ref', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'CreationTime') {
    if (field === undefined) {
      return right(DateField(new Date()));
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Increment') {
    if (field === undefined || field._type === 'Number') {
      return right(NumberField((field !== undefined ? field.value : 0) + writeField.value));
    }
    return left(
      applyDocWriteError({
        expectedFieldTypes: ['Number', 'undefined'],
        field,
      })
    );
  }
  // writeField._type === 'RefUpdate'

  if (field?._type === 'Ref') {
    return eitherMapRight(
      // eslint-disable-next-line no-use-before-define
      applyDocWrite({ doc: field.snapshot.doc, writeDoc: writeField.doc }),
      (newDoc) =>
        right(
          RefField({
            doc: newDoc,
            id: field.snapshot.id,
          })
        )
    );
  }
  return left(
    applyDocWriteError({
      expectedFieldTypes: ['Ref'],
      field,
    })
  );
}

export function applyDocWrite({
  doc,
  writeDoc,
}: {
  readonly doc: Doc | undefined;
  readonly writeDoc: WriteDoc;
}): Either<ApplyDocWriteError, Doc> {
  return Object.entries(writeDoc).reduce<Either<ApplyDocWriteError, Doc>>(
    (acc, [fieldName, writeField]) =>
      eitherMapRight(acc, (acc) =>
        eitherMapRight(applyFieldWrite({ field: doc?.[fieldName], writeField }), (field) =>
          right({ ...acc, [fieldName]: field })
        )
      ),
    right(doc ?? {})
  );
}
