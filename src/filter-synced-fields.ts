import { Either, Failed, foldValue, isDefined, Value } from 'trimop';

import { Doc, RefField } from './data';
import { InvalidFieldTypeFailure } from './invalid-field-type-failure';
import { SyncedFields } from './spec';

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
}): Either<InvalidFieldTypeFailure, Doc | undefined> {
  return Object.entries(syncedFields).reduce<Either<InvalidFieldTypeFailure, Doc | undefined>>(
    (acc, [fieldName, syncFieldSpec]) =>
      foldValue(acc, (acc) => {
        const field = doc[fieldName];
        if (isDefined(field)) {
          // Copy the field if defined in the spec
          if (syncFieldSpec === true) {
            return Value({
              ...acc,
              [fieldName]: field,
            });
          }

          if (field._type !== 'Ref') {
            return Failed(
              InvalidFieldTypeFailure({
                expectedFieldTypes: ['Ref'],
                field,
              })
            );
          }
          // Copy nested synced fields
          return foldValue(
            filterSyncedFields({
              doc: field.snapshot.doc,
              syncedFields: syncFieldSpec,
            }),
            (syncedDoc) => {
              // If there was no copied field
              if (!isDefined(syncedDoc)) {
                return Value(acc);
              }
              return Value({
                ...acc,
                [fieldName]: RefField({
                  doc: syncedDoc,
                  id: field.snapshot.id,
                }),
              });
            }
          );
        }
        // If synced field does not exists, do nothing
        return Value(acc);
      }),
    Value(undefined)
  );
}
