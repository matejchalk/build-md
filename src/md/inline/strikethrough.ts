import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
import type { BoldMark } from './bold';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { ItalicMark } from './italic';
import type { LinkMark } from './link';

type StrikethroughInnerMarks =
  | BoldMark
  | CodeMark
  | FootnoteMark
  | ItalicMark
  | LinkMark;

export function strikethrough<TInnerMarks extends StrikethroughInnerMarks>(
  text: TextInput<TInnerMarks>
): FormattedTextItem<StrikethroughMark | TInnerMarks> {
  return addMark(text, new StrikethroughMark());
}

export class StrikethroughMark implements IMark {
  render(text: string, ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 's', text });
    }
    return `~~${text}~~`;
  }
}
