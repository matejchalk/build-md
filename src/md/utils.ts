import type { IMark } from './mark';
import type { FormattedText, FormattedTextItem } from './text';

export function addMark<
  TInnerMarks extends IMark = IMark,
  TOuterMark extends IMark = IMark
>(
  text: string | FormattedTextItem<TInnerMarks> | FormattedText<TInnerMarks>,
  mark: TOuterMark
): FormattedTextItem<TOuterMark | TInnerMarks> {
  if (typeof text === 'string' || Array.isArray(text)) {
    return {
      text,
      marks: [mark],
    };
  }
  return {
    text: text.text,
    marks: [...(text.marks ?? []), mark],
  };
}
