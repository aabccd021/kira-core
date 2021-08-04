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

import { Doc, Field, RefField } from './data';
import { SyncedFields } from './spec';

// TODO: use option

/**
 * FilterSyncedFieldInvalidFieldTypeError
 */
export type FilterSyncedFieldsError = {
  readonly _errorType: 'FilterSyncedFieldsError';
  readonly field: Field;
};

export function FilterSyncedFieldsError(field: Field): FilterSyncedFieldsError {
  return {
    _errorType: 'FilterSyncedFieldsError',
    field,
  };
}

/**
 * Filter synced fields.
 * @param doc to be filtered
 * @param syncedFields
 * @returns synced fields if exists, undefined otherwise.
 */
export function filterSyncedFields({
  doc,
  syncedFields,
}: {
  readonly doc: Doc;
  readonly syncedFields: SyncedFields;
}): Either<FilterSyncedFieldsError, Option<Doc>> {
  return eitherArrayReduce<
    Option<Doc>,
    FilterSyncedFieldsError,
    readonly [string, true | SyncedFields]
  >(Object.entries(syncedFields), Right(None()), (ac, [fieldName, syncFieldSpec]) => {
    return optionFold<Either<FilterSyncedFieldsError, Option<Doc>>, Field>(
      optionFromNullable<Field>(doc[fieldName]),
      () => Right(ac),
      (field) => {
        const acc = optionFold(
          ac,
          () => ({}),
          (ac) => ac
        );
        // Copy the field if defined in the spec
        if (syncFieldSpec === true) {
          return Right(
            Some({
              ...acc,
              [fieldName]: field,
            })
          );
        }

        if (field._type !== 'Ref') {
          return Left(FilterSyncedFieldsError(field));
        }
        // Copy nested synced fields
        return eitherMapRight(
          filterSyncedFields({
            doc: field.snapshot.doc,
            syncedFields: syncFieldSpec,
          }),
          (syncedDoc) =>
            optionFold(
              syncedDoc,
              // If there was no copied field
              () => Right(Some(acc)),
              (syncedDoc) =>
                Right(
                  Some({
                    ...acc,
                    [fieldName]: RefField({
                      doc: syncedDoc,
                      id: field.snapshot.id,
                    }),
                  })
                )
            )
        );
      }
    );
  });
}
