import type { IMark } from '../mark';
import type { FormattedTextItem } from '../text';
import { addMark } from '../utils';

export function code(text: string): FormattedTextItem<CodeMark> {
  return addMark(text, new CodeMark());
}

export class CodeMark implements IMark {}
