import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';
import { renderInlineText, type InlineText } from '../text';
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

export function strikethrough(
  text: InlineText<StrikethroughInnerMarks>
): StrikethroughMark {
  return new StrikethroughMark(text);
}

export class StrikethroughMark implements IMark {
  constructor(public readonly text: InlineText<StrikethroughInnerMarks>) {}

  render(ctx: RenderContext): string {
    const text = renderInlineText(this.text, ctx);
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 's', text });
    }
    return `~~${text}~~`;
  }
}
