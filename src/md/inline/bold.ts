import type { IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
import { addMark } from '../utils';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { ItalicMark } from './italic';
import type { LinkMark } from './link';
import type { StrikethroughMark } from './strikethrough';

type BoldInnerMarks =
  | CodeMark
  | FootnoteMark
  | ItalicMark
  | LinkMark
  | StrikethroughMark;

export function bold<TInnerMarks extends BoldInnerMarks>(
  text: TextInput<TInnerMarks>
): FormattedTextItem<BoldMark | TInnerMarks> {
  return addMark(text, new BoldMark());
}

export class BoldMark implements IMark {}
