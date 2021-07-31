import { Failed, ShouldBeUnreachableFailure, Value } from 'trimop';

import { DateField, ImageField, isFieldEqual, NumberField, RefField, StringField } from '../src';

describe('isFieldEqual', () => {
  describe('StringField', () => {
    it('returns true if given same value', () => {
      const f1 = StringField('foo');
      const f2 = StringField('foo');
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns false if given different value', () => {
      const f1 = StringField('foo');
      const f2 = StringField('bar');
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given f2 undefined', () => {
      const f1 = StringField('foo');
      const f2 = undefined;
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });
  });

  describe('DateField', () => {
    it('returns true if given same value', () => {
      const f1 = DateField(new Date('2002-01-12T00:00:00Z'));
      const f2 = DateField(new Date('2002-01-12T00:00:00Z'));
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns false if given different value', () => {
      const f1 = DateField(new Date('2002-01-12T00:00:00Z'));
      const f2 = DateField(new Date('1998-02-21T00:00:00Z'));
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given f2 undefined', () => {
      const f1 = DateField(new Date('2002-01-12T00:00:00Z'));
      const f2 = undefined;
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });
  });

  describe('NumberField', () => {
    it('returns true if given same value', () => {
      const f1 = NumberField(46);
      const f2 = NumberField(46);
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns false if given different value', () => {
      const f1 = NumberField(46);
      const f2 = NumberField(21);
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given f2 undefined', () => {
      const f1 = NumberField(46);
      const f2 = undefined;
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });
  });

  describe('ImageField', () => {
    it('returns true if given same value', () => {
      const f1 = ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      });
      const f2 = ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns false if given different value', () => {
      const f1 = ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      });
      const f2 = ImageField({ url: 'https://keyakizaka.com/image/foo' });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given f2 undefined', () => {
      const f1 = ImageField({
        url: 'https://sakurazaka46.com/images/14/eb2/a748ca8dac608af8edde85b62a5a8/1000_1000_102400.jpg',
      });
      const f2 = undefined;
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });
  });

  describe('RefField', () => {
    it('returns true if given same value', () => {
      const f1 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      const f2 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns true if given same value nested', () => {
      const f1 = RefField({
        data: { owner: RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' }) },
        id: '21',
      });
      const f2 = RefField({
        data: { owner: RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' }) },
        id: '21',
      });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(true));
    });

    it('returns false if given different id', () => {
      const f1 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      const f2 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '21' });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if f1 is part of f2', () => {
      const f1 = RefField({
        data: { name: StringField('Kira Masumoto') },
        id: '46',
      });
      const f2 = RefField({
        data: { age: NumberField(21), name: StringField('Kira Masumoto') },
        id: '46',
      });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if f2 is part of f1', () => {
      const f1 = RefField({
        data: { age: NumberField(21), name: StringField('Kira Masumoto') },
        id: '46',
      });
      const f2 = RefField({
        data: { name: StringField('Kira Masumoto') },
        id: '46',
      });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given different subfield value', () => {
      const f1 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      const f2 = RefField({ data: { name: StringField('Karin Fujiyoshi') }, id: '46' });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given different subfield type', () => {
      const f1 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      const f2 = RefField({ data: { name: NumberField(19) }, id: '46' });
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });

    it('returns false if given f2 undefined', () => {
      const f1 = RefField({ data: { name: StringField('Kira Masumoto') }, id: '46' });
      const f2 = undefined;
      expect(isFieldEqual(f1, f2)).toStrictEqual(Value(false));
    });
  });

  it('should return shouldBeUnreachableFailure if given invalid field', () => {
    const f1 = { _type: 'someImpossibleType' } as unknown as StringField;
    const f2 = StringField('foo');
    expect(isFieldEqual(f1, f2)).toStrictEqual(Failed(ShouldBeUnreachableFailure(f1 as never)));
  });
});
