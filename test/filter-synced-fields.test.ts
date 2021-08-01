import { Value } from 'trimop';

import { Doc, NumberField, StringField, SyncedFields } from '../src';
import { filterSyncedFields } from '../src/filter-synced-fields';

describe('filterSyncedFields', () => {
  it('can filter properly', () => {
    const doc: Doc = {
      joinedYear: NumberField(2020),
      name: StringField('Masumoto Kira'),
    };
    const syncedFields: SyncedFields = {
      joinedYear: true,
    };
    expect(filterSyncedFields({ doc, syncedFields })).toStrictEqual(
      Value({
        joinedYear: NumberField(2020),
      })
    );
  });
});
