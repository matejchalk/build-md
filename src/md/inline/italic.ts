import type { IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
import { addMark } from '../utils';
import type { BoldMark } from './bold';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { LinkMark } from './link';
import type { StrikethroughMark } from './strikethrough';

type ItalicInnerMarks =
  | BoldMark
  | CodeMark
  | FootnoteMark
  | LinkMark
  | StrikethroughMark;

export function italic<TInnerMarks extends ItalicInnerMarks>(
  text: TextInput<TInnerMarks>
): FormattedTextItem<ItalicMark | TInnerMarks> {
  return addMark(text, new ItalicMark());
}

export class ItalicMark implements IMark {}
