import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';
import { renderInlineText, type InlineText } from '../text';
import type { BoldMark } from './bold';
import type { CodeMark } from './code';
import type { ImageMark } from './image';
import type { ItalicMark } from './italic';
import type { StrikethroughMark } from './strikethrough';

type LinkInnerMarks =
  | BoldMark
  | CodeMark
  | ItalicMark
  | ImageMark
  | StrikethroughMark;

export function link(
  href: string,
  text?: InlineText<LinkInnerMarks>,
  title?: string
): LinkMark {
  return new LinkMark(href, text, title);
}

export class LinkMark implements IMark {
  constructor(
    public readonly href: string,
    public readonly text?: InlineText<LinkInnerMarks>,
    public readonly title?: string
  ) {}

  render(ctx: RenderContext): string {
    const text = renderInlineText(this.text ?? '', ctx);
    if (ctx.isHtmlOnly) {
      return renderHtml({
        tag: 'a',
        attrs: { href: this.href, ...(this.title && { title: this.title }) },
        text: text || this.href,
      });
    }
    if (!text && !this.title) {
      return `<${this.href}>`;
    }
    return `[${text || this.href}](${this.href}${
      this.title ? ` "${this.title}"` : ''
    })`;
  }
}
