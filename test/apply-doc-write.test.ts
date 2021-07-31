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
  RefWriteField,
  StringField,
  WriteDoc,
  WriteField,
} from '../src';
import { applyDocWrite } from '../src/apply-doc-write';
import { ApplyFieldWriteFailure } from '../src/apply-field-write-failure';
import { almostEqualTimeBefore } from './util';

describe('applyDocWrite', () => {
  it('correctly apply write', () => {
    const doc: Doc = {
      age: NumberField(18),
      group: RefField({
        data: {
          name: StringField('Keyakizaka46'),
        },
        id: '46',
      }),
      luckyNumber: NumberField(7),
      name: StringField('Kira Masumoto'),
      nickname: StringField('dorokatsu'),
      profilePicture: ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      }),
    };
    const writeDoc: WriteDoc = {
      accountCreationTime: CreationTimeField(),
      age: IncrementField(1),
      birthday: DateField(new Date('2002-01-12T00:00:00Z')),
      group: RefWriteField({
        data: {
          age: IncrementField(1),
          logoPicture: ImageField({
            url: 'https://sakurazaka46.com/files/14/s46/img/com-logo_sp.svg',
          }),
          name: StringField('Sakurazaka46'),
        },
        id: '46',
      }),
      hobby: StringField('Rubiks Cube'),
      joinYear: NumberField(2020),
      mentor: RefWriteField({
        data: {
          name: StringField('AkaneMoriya'),
        },
        id: '23',
      }),
      nickname: StringField('Kirako'),
    };
    expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
      Value({
        accountCreationTime: {
          _type: 'date',
          value: expect.toSatisfy(almostEqualTimeBefore(new Date())),
        },
        age: NumberField(19),
        birthday: DateField(new Date('2002-01-12T00:00:00Z')),
        group: RefWriteField({
          data: {
            age: NumberField(1),
            logoPicture: ImageField({
              url: 'https://sakurazaka46.com/files/14/s46/img/com-logo_sp.svg',
            }),
            name: StringField('Sakurazaka46'),
          },
          id: '46',
        }),
        hobby: StringField('Rubiks Cube'),
        joinYear: NumberField(2020),
        luckyNumber: NumberField(7),
        mentor: RefWriteField({
          data: {
            name: StringField('AkaneMoriya'),
          },
          id: '23',
        }),
        name: StringField('Kira Masumoto'),
        nickname: StringField('Kirako'),
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
          ApplyFieldWriteFailure({
            expectedFieldTypes: ['number', 'undefined'],
            field: StringField('Sakurazaka46'),
          })
        )
      );
    });
  });

  describe('RefWriteField', () => {
    it('fails to update if previous value is not a RefField', () => {
      const doc: Doc = {
        group: StringField('Keyakizaka46'),
      };
      const writeDoc: WriteDoc = {
        group: RefWriteField({
          data: {
            name: StringField('Sakurazaka46'),
          },
          id: '46',
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Failed(
          ApplyFieldWriteFailure({
            expectedFieldTypes: ['ref'],
            field: StringField('Keyakizaka46'),
          })
        )
      );
    });
  });

  it('should return shouldBeUnreachableFailure if given invalid field', () => {
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
