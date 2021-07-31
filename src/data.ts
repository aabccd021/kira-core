/* istanbul ignore file */
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
export function RefWriteField(value: WriteDocSnapshot): RefWriteField {
  return {
    _type: 'ref',
    value,
  };
}

export type RefWriteField = {
  readonly _type: 'ref';
  // eslint-disable-next-line no-use-before-define
  readonly value: WriteDocSnapshot;
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
 * Doc
 */
export type DocKey = {
  readonly col: string;
  readonly id: string;
};

export type Field = BaseField & (StringField | NumberField | DateField | ImageField | RefField);

export type WriteField = BaseField &
  (
    | StringField
    | NumberField
    | DateField
    | ImageField
    | CreationTimeField
    | IncrementField
    | RefWriteField
  );

export type Doc = Dict<Field>;

export type DocSnapshot = {
  readonly data: Doc;
  readonly id: string;
};

export type WriteDoc = Dict<WriteField>;

export type WriteDocSnapshot = {
  readonly data: WriteDoc;
  readonly id: string;
};
