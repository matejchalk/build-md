/** Content which may include falsy value from conditional expression, in which case document block should be skipped. */
export type Conditional<T> = T | null | undefined | false | 0;
