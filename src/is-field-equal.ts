import { Field } from './data';

export function isFieldEqual(f1: Field, f2: Field | undefined): boolean {
  if (f1._type === 'Date') {
    return f2?._type === 'Date' && f1.value.getTime() === f2.value.getTime();
  }

  if (f1._type === 'Number') {
    return f2?._type === 'Number' && f1.value === f2.value;
  }

  if (f1._type === 'String') {
    return f2?._type === 'String' && f1.value === f2.value;
  }

  if (f1._type === 'Image') {
    return f2?._type === 'Image' && f2.value.url === f1.value.url;
  }

  // f1._type === 'Ref'
  if (f2?._type !== 'Ref') {
    return false;
  }

  return (
    f1.snapshot.id === f2.snapshot.id &&
    Object.keys(f1.snapshot.doc).length === Object.keys(f2.snapshot.doc).length &&
    Object.entries(f1.snapshot.doc).every(([field1ChildName, field1Child]) =>
      isFieldEqual(field1Child, f2.snapshot.doc[field1ChildName])
    )
  );
}
