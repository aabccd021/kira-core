import { Option, optionFold, optionFromNullable } from 'trimop';

import { Field } from './data';

export function isFieldEqual(f1: Field, f2: Option<Field>): boolean {
  if (f1._type === 'Date') {
    return optionFold(
      f2,
      () => false,
      (f2) => f2?._type === 'Date' && f1.value.getTime() === f2.value.getTime()
    );
  }

  if (f1._type === 'Number') {
    return optionFold(
      f2,
      () => false,
      (f2) => f2?._type === 'Number' && f1.value === f2.value
    );
  }

  if (f1._type === 'String') {
    return optionFold(
      f2,
      () => false,
      (f2) => f2?._type === 'String' && f1.value === f2.value
    );
  }

  if (f1._type === 'Image') {
    return optionFold(
      f2,
      () => false,
      (f2) => f2?._type === 'Image' && f2.value.url === f1.value.url
    );
  }

  // f1._type === 'Ref'
  return optionFold(
    f2,
    () => false,
    (f2) =>
      f2._type !== 'Ref'
        ? false
        : f1.snapshot.id === f2.snapshot.id &&
          Object.keys(f1.snapshot.doc).length === Object.keys(f2.snapshot.doc).length &&
          Object.entries(f1.snapshot.doc).every(([field1ChildName, field1Child]) =>
            isFieldEqual(field1Child, optionFromNullable<Field>(f2.snapshot.doc[field1ChildName]))
          )
  );
}
