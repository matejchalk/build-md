import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
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

export class ItalicMark implements IMark {
  render(text: string, ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'i', text });
    }
    return `_${text}_`;
  }
}
