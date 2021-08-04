import 'jest-extended';

import { Left, None, Right, Some } from 'trimop';

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
} from '../src';
import { applyDocWrite, ApplyDocWriteError } from '../src/apply-doc-write';
import { almostEqualTimeBefore } from './util';

describe('applyDocWrite', () => {
  it('correctly apply write', () => {
    const doc: Some<Doc> = Some({
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
      mentor: RefField({
        doc: {
          name: StringField('Akanen'),
        },
        id: 'akanen',
      }),
      name: StringField('Kira Masumoto'),
      nickname: StringField('dorokatsu'),
      profilePicture: ImageField({
        url: 'https://sakurazaka46.com/images/14/7ef/aa0bc399d68377e1e6611efb802b4.jpg',
      }),
    });
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
      mentor: RefField({
        doc: {
          name: StringField('Moriya Akane'),
        },
        id: 'akanen',
      }),
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
      Right({
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
        mentor: RefField({
          doc: {
            name: StringField('Moriya Akane'),
          },
          id: 'akanen',
        }),
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
      const doc: Some<Doc> = Some({
        groupName: StringField('Sakurazaka46'),
      });
      const writeDoc: WriteDoc = {
        groupName: IncrementField(2),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Sakurazaka46'))))
      );
    });
  });

  describe('RefUpdateField', () => {
    it('returns ApplyDocWriteError if previous value is not a RefField', () => {
      const doc: Some<Doc> = Some({
        group: StringField('Keyakizaka46'),
      });
      const writeDoc: WriteDoc = {
        group: RefUpdateField({
          name: StringField('Sakurazaka46'),
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Keyakizaka46'))))
      );
    });

    it('returns ApplyDocWriteError if previous value is none', () => {
      const writeDoc: WriteDoc = {
        group: RefUpdateField({
          name: StringField('Sakurazaka46'),
        }),
      };
      expect(applyDocWrite({ doc: Some({}), writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(None()))
      );
    });
  });

  describe('StringField', () => {
    it('returns ApplyDocWriteError if previous value is not StringField', () => {
      const doc: Some<Doc> = Some({
        joinYear: NumberField(2020),
      });
      const writeDoc: WriteDoc = {
        joinYear: StringField('2020'),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(NumberField(2020))))
      );
    });
  });

  describe('RefField', () => {
    it('returns ApplyDocWriteError if previous value is not RefField', () => {
      const doc: Some<Doc> = Some({
        hobby: StringField('rubiks'),
      });
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
        Left(ApplyDocWriteError(Some(StringField('rubiks'))))
      );
    });
  });

  describe('NumberField', () => {
    it('returns ApplyDocWriteError if previous value is not NumberField', () => {
      const doc: Some<Doc> = Some({
        name: StringField('Masumoto Kira'),
      });
      const writeDoc: WriteDoc = {
        name: NumberField(21),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Masumoto Kira'))))
      );
    });
  });

  describe('ImageField', () => {
    it('returns ApplyDocWriteError if previous value is not ImageField', () => {
      const doc: Some<Doc> = Some({
        name: StringField('Masumoto Kira'),
      });
      const writeDoc: WriteDoc = {
        name: ImageField({
          url: 'https://sakurazaka46.com/images/14/7ef/aa0bc399d68377e1e6611efb802b4.jpg',
        }),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Masumoto Kira'))))
      );
    });
  });

  describe('DateField', () => {
    it('returns ApplyDocWriteError if previous value is not DateField', () => {
      const doc: Some<Doc> = Some({
        name: StringField('Masumoto Kira'),
      });
      const writeDoc: WriteDoc = {
        name: DateField(new Date()),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Masumoto Kira'))))
      );
    });
  });

  describe('CreationTimeField', () => {
    it('returns ApplyDocWriteError if previous value is not none', () => {
      const doc: Some<Doc> = Some({
        name: StringField('Masumoto Kira'),
      });
      const writeDoc: WriteDoc = {
        name: CreationTimeField(),
      };
      expect(applyDocWrite({ doc, writeDoc })).toStrictEqual(
        Left(ApplyDocWriteError(Some(StringField('Masumoto Kira'))))
      );
    });
  });

  it('just write if previous doc is empty', () => {
    const writeDoc: WriteDoc = {
      name: StringField('Kira Masumoto'),
    };
    expect(applyDocWrite({ doc: None(), writeDoc })).toStrictEqual(
      Right({
        name: StringField('Kira Masumoto'),
      })
    );
  });
});
