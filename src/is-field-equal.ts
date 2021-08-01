import { Either, Failed, foldValue, ShouldBeUnreachableFailure, Value } from 'trimop';

import { Field } from './data';

export function isFieldEqual(
  f1: Field,
  f2: Field | undefined
): Either<ShouldBeUnreachableFailure, boolean> {
  if (f1._type === 'Date') {
    return Value(f2?._type === 'Date' && f1.value.getTime() === f2.value.getTime());
  }

  if (f1._type === 'Number') {
    return Value(f2?._type === 'Number' && f1.value === f2.value);
  }

  if (f1._type === 'String') {
    return Value(f2?._type === 'String' && f1.value === f2.value);
  }

  if (f1._type === 'Image') {
    return Value(f2?._type === 'Image' && f2.value.url === f1.value.url);
  }

  if (f1._type === 'Ref') {
    if (f2?._type !== 'Ref') {
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
