import 'jest-extended';

import { Failed, ShouldBeUnreachableFailure, Value } from 'trimop';

import {
  CreationTimeField,
  DateField,
  Doc,
  ImageField,
  IncrementField,
  NumberField,
  RefField,
  RefUpdateField,
  StringField,
  WriteDoc,
  WriteField,
} from '../src';
import { applyDocWrite } from '../src/apply-doc-write';
import { InvalidFieldTypeFailure } from '../src/invalid-field-type-failure';
import { almostEqualTimeBefore } from './util';

describe('applyDocWrite', () => {
  it('correctly apply write', () => {
    const doc: Doc = {
      age: NumberField(18),
      favoriteNumber: NumberField(7),
      group: RefField({
        doc: {
          name: StringField('Keyakizaka46'),
        },
        id: 'keyakizaka',
      }),
      hobby: RefField({
        doc: {
          name: StringField('Rubiks Cube'),
          record: NumberField(60),
        },
        id: 'rubiks',
      }),
      latestBlogUpdate: DateField(new Date('2020-09-12T00:00:00Z')),
      name: StringField('Kira Masumoto'),
      nickname: StringField('dorokatsu'),
      profilePicture: ImageField({
        url: 'https://sakurazaka46.com/images/14/7ef/aa0bc399d68377e1e6611efb802b4.jpg',
      }),
    };
    const writeDoc: WriteDoc = {
      accountCreationTime: CreationTimeField(),
      age: IncrementField(1),
      birthday: DateField(new Date('2002-01-12T00:00:00Z')),
      group: RefUpdateField({
        age: IncrementField(1),
        logoPicture: ImageField({
          url: 'https://sakurazaka46.com/files/14/s46/img/com-logo_sp.svg',
        }),
        name: StringField('Sakurazaka46'),
      }),
      hobby: RefUpdateField({
        record: NumberField(40),
      }),
      joinYear: NumberField(2020),
      latestBlogUpdate: DateField(new Date('2021-01-01T00:00:00Z')),
      nickname: StringField('Kirako'),
      origin: RefField({
        doc: {
          region: StringField('kansai'),
        },
        id: 'hyougo',
      }),
      profilePicture: ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      }),
    };
    expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
      Value({
        accountCreationTime: {
          _type: 'Date',
          value: expect.toSatisfy(almostEqualTimeBefore(new Date())),
        },
        age: NumberField(19),
        birthday: DateField(new Date('2002-01-12T00:00:00Z')),
        favoriteNumber: NumberField(7),
        group: RefField({
          doc: {
            age: NumberField(1),
            logoPicture: ImageField({
              url: 'https://sakurazaka46.com/files/14/s46/img/com-logo_sp.svg',
            }),
            name: StringField('Sakurazaka46'),
          },
          id: 'keyakizaka',
        }),
        hobby: RefField({
          doc: {
            name: StringField('Rubiks Cube'),
            record: NumberField(40),
          },
          id: 'rubiks',
        }),
        joinYear: NumberField(2020),
        latestBlogUpdate: DateField(new Date('2021-01-01T00:00:00Z')),
        name: StringField('Kira Masumoto'),
        nickname: StringField('Kirako'),
        origin: RefField({
          doc: {
            region: StringField('kansai'),
          },
          id: 'hyougo',
        }),
        profilePicture: ImageField({
          url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
        }),
      })
    );
  });
  describe('IncrementField', () => {
    it('fails to increment if previous value is not a NumberField', () => {
      const doc: Doc = {
        groupName: StringField('Sakurazaka46'),
      };
      const writeDoc: WriteDoc = {
        groupName: IncrementField(2),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Number', 'undefined'],
            field: StringField('Sakurazaka46'),
          })
        )
      );
    });
  });

  describe('RefUpdateField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not a RefField', () => {
      const doc: Doc = {
        group: StringField('Keyakizaka46'),
      };
      const writeDoc: WriteDoc = {
        group: RefUpdateField({
          name: StringField('Sakurazaka46'),
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Ref'],
            field: StringField('Keyakizaka46'),
          })
        )
      );
    });

    it('returns shouldBeUnreachableFailure if previous value is undefined', () => {
      const doc: Doc = {};
      const writeDoc: WriteDoc = {
        group: RefUpdateField({
          name: StringField('Sakurazaka46'),
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Ref'],
            field: undefined,
          })
        )
      );
    });
  });

  describe('StringField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not StringField', () => {
      const doc: Doc = {
        joinYear: NumberField(2020),
      };
      const writeDoc: WriteDoc = {
        joinYear: StringField('2020'),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['String', 'undefined'],
            field: NumberField(2020),
          })
        )
      );
    });
  });

  describe('RefField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not RefField', () => {
      const doc: Doc = {
        hobby: StringField('rubiks'),
      };
      const writeDoc: WriteDoc = {
        hobby: RefField({
          doc: {
            name: StringField('Rubiks Cube'),
            record: NumberField(60),
          },
          id: 'rubiks',
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Ref', 'undefined'],
            field: StringField('rubiks'),
          })
        )
      );
    });
  });

  describe('NumberField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not NumberField', () => {
      const doc: Doc = {
        name: StringField('Masumoto Kira'),
      };
      const writeDoc: WriteDoc = {
        name: NumberField(21),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Number', 'undefined'],
            field: StringField('Masumoto Kira'),
          })
        )
      );
    });
  });

  describe('ImageField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not ImageField', () => {
      const doc: Doc = {
        name: StringField('Masumoto Kira'),
      };
      const writeDoc: WriteDoc = {
        name: ImageField({
          url: 'https://sakurazaka46.com/images/14/7ef/aa0bc399d68377e1e6611efb802b4.jpg',
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Image', 'undefined'],
            field: StringField('Masumoto Kira'),
          })
        )
      );
    });
  });

  describe('DateField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not DateField', () => {
      const doc: Doc = {
        name: StringField('Masumoto Kira'),
      };
      const writeDoc: WriteDoc = {
        name: DateField(new Date()),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['Date', 'undefined'],
            field: StringField('Masumoto Kira'),
          })
        )
      );
    });
  });

  describe('CreationTimeField', () => {
    it('returns shouldBeUnreachableFailure if previous value is not undefined', () => {
      const doc: Doc = {
        name: StringField('Masumoto Kira'),
      };
      const writeDoc: WriteDoc = {
        name: CreationTimeField(),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          InvalidFieldTypeFailure({
            expectedFieldTypes: ['undefined'],
            field: StringField('Masumoto Kira'),
          })
        )
      );
    });
  });

  it('returns shouldBeUnreachableFailure if given invalid field', () => {
    const doc: Doc = {
      group: StringField('Keyakizaka46'),
    };
    const writeField = { _type: 'impossibleWriteField' } as unknown as WriteField;
    const writeDoc = { field: writeField };
    expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
      Failed(ShouldBeUnreachableFailure(writeField as never))
    );
  });

  it('just write if previous doc is empty', () => {
    const writeDoc: WriteDoc = {
      name: StringField('Kira Masumoto'),
    };
    expect(applyDocWrite({ doc: undefined, writeDoc })).toStrictEqual(
      Value({
        name: StringField('Kira Masumoto'),
      })
    );
  });
});
