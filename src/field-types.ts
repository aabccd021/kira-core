export type ThisColReferFields = readonly {
  readonly colName: string;
  readonly fieldNames: readonly string[];
  readonly thisColReferFields: ThisColReferFields;
}[];
