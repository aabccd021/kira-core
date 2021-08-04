import {
  Either,
  eitherArrayReduce,
  eitherMapRight,
  left,
  optionFold,
  optionFromNullable,
  right,
} from 'trimop';

import { Doc, Field, RefField } from './data';
import { SyncedFields } from './spec';

// TODO: use option

/**
 * FilterSyncedFieldInvalidFieldTypeError
 */
export type FilterSyncedFieldsError = {
  readonly expectedFieldTypes: readonly (Field['_type'] | 'undefined')[];
  readonly field: Field | undefined;
};

export function filterSyncedFieldsError(p: FilterSyncedFieldsError): FilterSyncedFieldsError {
  return {
    ...p,
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
  >(Object.entries(syncedFields), right(undefined), (acc, [fieldName, syncFieldSpec]) => {
    return optionFold(
      optionFromNullable<Field>(doc[fieldName]),
      () => right(acc),
      (field) => {
        // Copy the field if defined in the spec
        if (syncFieldSpec === true) {
          return right({
            ...acc,
            [fieldName]: field,
          });
        }

        if (field._type !== 'Ref') {
          return left(
            filterSyncedFieldsError({
              expectedFieldTypes: ['Ref'],
              field,
            })
          );
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
              () => right(acc),
              (syncedDoc) =>
                right({
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
