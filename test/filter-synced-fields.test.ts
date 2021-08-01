import { Failed, Value } from 'trimop';

import {
  Doc,
  InvalidFieldTypeFailure,
  NumberField,
  RefField,
  StringField,
  SyncedFields,
} from '../src';
import { filterSyncedFields } from '../src/filter-synced-fields';

describe('filterSyncedFields', () => {
  it('can filter properly', () => {
    const doc: Doc = {
      joinedYear: NumberField(2020),
      mentor: RefField({
        doc: {
          name: StringField('Akane Moriya'),
          origin: RefField({
            doc: {
              food: StringField('Kakigori'),
              region: StringField('East Japan'),
            },
            id: 'miyagi',
          }),
          position: StringField('Sergeant'),
        },
        id: 'akanen',
      }),
      name: StringField('Masumoto Kira'),
      oshi: RefField({
        doc: {
          name: StringField('Yuuka Sugai'),
        },
        id: 'yukka',
      }),
    };
    const syncedFields: SyncedFields = {
      hobby: true,
      joinedYear: true,
      mentor: {
        origin: {
          region: true,
        },
        position: true,
      },
      oshi: {
        respectLevel: true,
      },
    };
    expect(filterSyncedFields({ doc, syncedFields })).toStrictEqual(
      Value({
        joinedYear: NumberField(2020),
        mentor: RefField({
          doc: {
            origin: RefField({
              doc: {
                region: StringField('East Japan'),
              },
              id: 'miyagi',
            }),
            position: StringField('Sergeant'),
          },
          id: 'akanen',
        }),
      })
    );
  });

  it('returns InvalidFieldTypeFailure if given other than refField on nested sync', () => {
    const doc: Doc = {
      mentor: StringField('Akane Moriya'),
    };
    const syncedFields: SyncedFields = {
      mentor: {
        name: true,
      },
    };
    expect(filterSyncedFields({ doc, syncedFields })).toStrictEqual(
      Failed(
        InvalidFieldTypeFailure({ expectedFieldTypes: ['Ref'], field: StringField('Akane Moriya') })
      )
    );
  });
});
