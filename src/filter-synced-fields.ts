import { isDefined } from 'trimop';

import { Doc, RefField, SyncedFields } from '.';

export function filterSyncedFields({
  data,
  syncedFields,
}: {
  readonly data: Doc;
  readonly syncedFields: SyncedFields;
}): Doc | undefined {
  return Object.entries(syncedFields).reduce<Doc | undefined>((acc, [fieldName, field]) => {
    const diffField = data[fieldName];
    if (isDefined(diffField)) {
      if (field === true) {
        return {
          ...acc,
          [fieldName]: diffField,
        };
      }
      if (diffField._type === 'ref') {
        const data = filterSyncedFields({
          data: diffField.value.data,
          syncedFields: field,
        });
        if (isDefined(data)) {
          return {
            ...acc,
            [fieldName]: RefField({
              data,
              id: diffField.value.id,
            }),
          };
        }
      }
    }
    return acc;
  }, undefined);
}
