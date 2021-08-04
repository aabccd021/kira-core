import { Either, eitherMapRight, Left, Right } from 'trimop';

import { DateField, Doc, Field, NumberField, RefField, WriteDoc, WriteField } from './data';

/**
 * ApplyDocWriteError
 */
export type ApplyDocWriteError = {
  readonly expectedFieldTypes: readonly (Field['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export function ApplyDocWriteError(p: ApplyDocWriteError): ApplyDocWriteError {
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
      return Right(writeField);
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['String', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Number') {
    if (field === undefined || field._type === 'Number') {
      return Right(writeField);
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['Number', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Image') {
    if (field === undefined || field._type === 'Image') {
      return Right(writeField);
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['Image', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Date') {
    if (field === undefined || field._type === 'Date') {
      return Right(writeField);
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['Date', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Ref') {
    if (field === undefined || field._type === 'Ref') {
      return Right(writeField);
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['Ref', 'undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'CreationTime') {
    if (field === undefined) {
      return Right(DateField(new Date()));
    }
    return Left(
      ApplyDocWriteError({
        expectedFieldTypes: ['undefined'],
        field,
      })
    );
  }
  if (writeField._type === 'Increment') {
    if (field === undefined || field._type === 'Number') {
      return Right(NumberField((field !== undefined ? field.value : 0) + writeField.value));
    }
    return Left(
      ApplyDocWriteError({
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
        Right(
          RefField({
            doc: newDoc,
            id: field.snapshot.id,
          })
        )
    );
  }
  return Left(
    ApplyDocWriteError({
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
          Right({ ...acc, [fieldName]: field })
        )
      ),
    Right(doc ?? {})
  );
}
