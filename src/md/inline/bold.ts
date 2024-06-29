import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';
import { renderInlineText, type InlineText } from '../text';
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
  text: InlineText<TInnerMarks>
): BoldMark<TInnerMarks> {
  return new BoldMark<TInnerMarks>(text);
}

export class BoldMark<TInnerMarks extends BoldInnerMarks = BoldInnerMarks>
  implements IMark
{
  constructor(public readonly text: InlineText<TInnerMarks>) {}

  render(ctx: RenderContext): string {
    const text = renderInlineText(this.text, ctx);
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'b', text });
    }
    return `**${text}**`;
  }
}
