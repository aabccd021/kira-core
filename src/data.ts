import { Dict } from 'trimop';
/**
 * Field
 */
export type BaseField = {
  readonly _type: string;
};

/**
 *StringField
 */
export function StringField(value: string): StringField {
  return { _type: 'string', value };
}

export type StringField = {
  readonly _type: 'string';
  readonly value: string;
};

/**
 *NumberField
 */
export function NumberField(value: number): NumberField {
  return { _type: 'number', value };
}

export type NumberField = {
  readonly _type: 'number';
  readonly value: number;
};

/**
 *DateField
 */
export function DateField(value: Date): DateField {
  return { _type: 'date', value };
}

export type DateField = {
  readonly _type: 'date';
  readonly value: Date;
};

/**
 *RefField
 */
// eslint-disable-next-line no-use-before-define
export function RefField(value: DocSnapshot): RefField {
  return { _type: 'ref', value };
}

export type RefField = {
  readonly _type: 'ref';
  // eslint-disable-next-line no-use-before-define
  readonly value: DocSnapshot;
};

/**
 * RefWriteField
 */
// eslint-disable-next-line no-use-before-define
export function RefWriteField(value: WriteDoc): RefWriteField {
  return {
    _type: 'ref',
    value,
  };
}

export type RefWriteField = {
  readonly _type: 'ref';
  // eslint-disable-next-line no-use-before-define
  readonly value: WriteDoc;
};

/**
 *StringArrayField
 */
export function StringArrayField(value: readonly string[]): StringArrayField {
  return {
    _type: 'stringArray',
    value,
  };
}

export type StringArrayField = {
  readonly _type: 'stringArray';
  readonly value: readonly string[];
};

/**
 *ImageField
 */
export type ImageFieldValue = {
  readonly url: string;
};

export function ImageField(value: ImageFieldValue): ImageField {
  return {
    _type: 'image',
    value,
  };
}

export type ImageField = {
  readonly _type: 'image';
  readonly value: ImageFieldValue;
};

/**
 *CreationTimeField
 */
export function CreationTimeField(): CreationTimeField {
  return { _type: 'creationTime' };
}

export type CreationTimeField = {
  readonly _type: 'creationTime';
};

/**
 *CreationTimeField
 */
export function IncrementField(value: number): IncrementField {
  return {
    _type: 'increment',
    value,
  };
}

export type IncrementField = {
  readonly _type: 'increment';
  readonly value: number;
};

/**
 *StringArrayUnionField
 */
export function StringArrayUnionField(value: string): StringArrayUnionField {
  return {
    _type: 'stringArrayUnion',
    value,
  };
}

export type StringArrayUnionField = {
  readonly _type: 'stringArrayUnion';
  readonly value: string;
};

/**
 *StringArrayRemoveField
 */
export function StringArrayRemoveField(value: string): StringArrayRemoveField {
  return {
    _type: 'stringArrayRemove',
    value,
  };
}

export type StringArrayRemoveField = {
  readonly _type: 'stringArrayRemove';
  readonly value: string;
};

/**
 * Doc
 */
export type DocKey = {
  readonly col: string;
  readonly id: string;
};

export type Field = BaseField &
  (StringField | NumberField | DateField | StringArrayField | ImageField | RefField);

export type WriteField = BaseField &
  (
    | StringField
    | NumberField
    | DateField
    | StringArrayField
    | ImageField
    | CreationTimeField
    | IncrementField
    | StringArrayUnionField
    | StringArrayRemoveField
    | RefWriteField
  );

export type Doc = Dict<Field>;

export type DocSnapshot = {
  readonly data: Doc;
  readonly id: string;
};

export type WriteDoc = Dict<WriteField>;
