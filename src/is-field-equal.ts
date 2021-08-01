import { Either, Failed, foldValue, ShouldBeUnreachableFailure, Value } from 'trimop';

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

  if (f1._type === 'image') {
    return Value(f2?._type === 'image' && f2.value.url === f1.value.url);
  }

  if (f1._type === 'ref') {
    if (f2?._type !== 'ref') {
      return Value(false);
    }

    return Object.entries(f1.snapshot.doc).reduce<Either<ShouldBeUnreachableFailure, boolean>>(
      (acc, [field3ChildName, field3Child]) =>
        foldValue(acc, (acc) =>
          foldValue(isFieldEqual(field3Child, f2.snapshot.doc[field3ChildName]), (isEqual) =>
            Value(
              isEqual &&
                acc &&
                f1.snapshot.id === f2.snapshot.id &&
                Object.keys(f1.snapshot.doc).length === Object.keys(f2.snapshot.doc).length
            )
          )
        ),
      Value(true)
    );
  }
  return Failed(ShouldBeUnreachableFailure(f1));
}
