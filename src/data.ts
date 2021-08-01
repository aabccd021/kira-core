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
  return { _type: 'String', value };
}

export type StringField = {
  readonly _type: 'String';
  readonly value: string;
};

/**
 *NumberField
 */
export function NumberField(value: number): NumberField {
  return { _type: 'Number', value };
}

export type NumberField = {
  readonly _type: 'Number';
  readonly value: number;
};

/**
 *DateField
 */
export function DateField(value: Date): DateField {
  return { _type: 'Date', value };
}

export type DateField = {
  readonly _type: 'Date';
  readonly value: Date;
};

/**
 *RefField
 */
// eslint-disable-next-line no-use-before-define
export function RefField(snapshot: DocSnapshot): RefField {
  return { _type: 'Ref', snapshot };
}

export type RefField = {
  readonly _type: 'Ref';
  // eslint-disable-next-line no-use-before-define
  readonly snapshot: DocSnapshot;
};

/**
 * RefUpdateField
 */
// eslint-disable-next-line no-use-before-define
export function RefUpdateField(doc: WriteDoc): RefUpdateField {
  return {
    _type: 'RefUpdate',
    doc,
  };
}

export type RefUpdateField = {
  readonly _type: 'RefUpdate';
  // eslint-disable-next-line no-use-before-define
  readonly doc: WriteDoc;
};

/**
 *ImageField
 */
export type ImageFieldValue = {
  readonly url: string;
};

export function ImageField(value: ImageFieldValue): ImageField {
  return {
    _type: 'Image',
    value,
  };
}

export type ImageField = {
  readonly _type: 'Image';
  readonly value: ImageFieldValue;
};

/**
 *CreationTimeField
 */
export function CreationTimeField(): CreationTimeField {
  return { _type: 'CreationTime' };
}

export type CreationTimeField = {
  readonly _type: 'CreationTime';
};

/**
 *CreationTimeField
 */
export function IncrementField(value: number): IncrementField {
  return {
    _type: 'Increment',
    value,
  };
}

export type IncrementField = {
  readonly _type: 'Increment';
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
    | RefField
    | RefUpdateField
  );

export type Doc = Dict<Field>;

export type DocSnapshot = {
  readonly doc: Doc;
  readonly id: string;
};

export type WriteDoc = Dict<WriteField>;

export type WriteDocSnapshot = {
  readonly doc: WriteDoc;
  readonly id: string;
};
