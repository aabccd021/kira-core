import { Either, Failed, foldRight, isDefined, Value } from 'trimop';

import { Doc, RefField } from './data';
import { InvalidFieldTypeFailure } from './invalid-field-type-failure';
import { SyncedFields } from './spec';

export function filterSyncedFields({
  doc,
  syncedFields,
}: {
  readonly doc: Doc;
  readonly syncedFields: SyncedFields;
}): Either<InvalidFieldTypeFailure, Doc | undefined> {
  return Object.entries(syncedFields).reduce<Either<InvalidFieldTypeFailure, Doc | undefined>>(
    (acc, [fieldName, syncFieldSpec]) =>
      foldRight(acc, (acc) => {
        const field = doc[fieldName];
        if (isDefined(field)) {
          // Copy the field if defined in the spec
          if (syncFieldSpec === true) {
            return Value({
              ...acc,
              [fieldName]: field,
            });
          }

          if (field._type !== 'ref') {
            return Failed(
              InvalidFieldTypeFailure({
                expectedFieldTypes: ['ref'],
                field,
              })
            );
          }
          // Copy nested synced fields
          if (field._type === 'ref') {
            return foldRight(
              filterSyncedFields({
                doc: field.snapshot.doc,
                syncedFields: syncFieldSpec,
              }),
              (syncedDoc) => {
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
        }
        return Value(acc);
      }),
    Value(undefined)
  );
}
