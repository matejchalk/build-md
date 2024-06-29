import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';
import { renderInlineText, type InlineText } from '../text';
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

export function italic(text: InlineText<ItalicInnerMarks>): ItalicMark {
  return new ItalicMark(text);
}

export class ItalicMark implements IMark {
  constructor(public readonly text: InlineText<ItalicInnerMarks>) {}

  render(ctx: RenderContext): string {
    const text = renderInlineText(this.text, ctx);
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'i', text });
    }
    return `_${text}_`;
  }
}
