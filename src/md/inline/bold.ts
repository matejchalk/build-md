import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
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

export class BoldMark implements IMark {
  render(text: string, ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'b', text });
    }
    return `**${text}**`;
  }
}
