import { Either, Failed, foldRight, ShouldBeUnreachableFailure, Value } from 'trimop';

import { Field } from './data';

export function isFieldEqual(
  f1: Field,
  f2: Field | undefined
): Either<ShouldBeUnreachableFailure, boolean> {
  if (f1._type === 'date') {
    return Value(f2?._type === 'date' && f1.value.getTime() === f2.value.getTime());
  }

  if (f1._type === 'number') {
    return Value(f2?._type === 'number' && f1.value === f2.value);
  }

  if (f1._type === 'string') {
    return Value(f2?._type === 'string' && f1.value === f2.value);
  }

  if (f1._type === 'stringArray') {
    return Value(
      f2?._type === 'stringArray' &&
        f1.value.length === f2.value.length &&
        f1.value.every((val, idx) => val === f2.value[idx])
    );
  }

  if (f1._type === 'image') {
    return Value(f2?._type === 'image' && f2.value.url === f1.value.url);
  }

  if (f1._type === 'ref') {
    if (f2?._type !== 'ref') {
      return Value(false);
    }

    return Object.entries(f1.value.data).reduce<Either<ShouldBeUnreachableFailure, boolean>>(
      (acc, [field3ChildName, field3Child]) =>
        foldRight(acc, (acc) =>
          foldRight(isFieldEqual(field3Child, f2.value.data[field3ChildName]), (isEqual) =>
            Value(f1.value.id === f2.value.id && acc && isEqual)
          )
        ),
      Value(true)
    );
  }
  return Failed(ShouldBeUnreachableFailure(f1));
}
