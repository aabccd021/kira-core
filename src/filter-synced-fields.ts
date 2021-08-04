import {
  Either,
  eitherArrayReduce,
  eitherMapRight,
  Left,
  optionFold,
  optionFromNullable,
  Right,
} from 'trimop';

import { Doc, Field, RefField } from './data';
import { SyncedFields } from './spec';

// TODO: use option

/**
 * FilterSyncedFieldInvalidFieldTypeError
 */
export type FilterSyncedFieldsError = {
  readonly _errorType: 'FilterSyncedFieldsError';
  readonly field: Field | undefined;
};

export function FilterSyncedFieldsError(field: Field | undefined): FilterSyncedFieldsError {
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
}): Either<FilterSyncedFieldsError, Doc | undefined> {
  return eitherArrayReduce<
    Doc | undefined,
    FilterSyncedFieldsError,
    readonly [string, true | SyncedFields]
  >(Object.entries(syncedFields), Right(undefined), (acc, [fieldName, syncFieldSpec]) => {
    return optionFold(
      optionFromNullable<Field>(doc[fieldName]),
      () => Right(acc),
      (field) => {
        // Copy the field if defined in the spec
        if (syncFieldSpec === true) {
          return Right({
            ...acc,
            [fieldName]: field,
          });
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
              optionFromNullable(syncedDoc),
              // If there was no copied field
              () => Right(acc),
              (syncedDoc) =>
                Right({
                  ...acc,
                  [fieldName]: RefField({
                    doc: syncedDoc,
                    id: field.snapshot.id,
                  }),
                })
            )
        );
      }
    );
  });
}
