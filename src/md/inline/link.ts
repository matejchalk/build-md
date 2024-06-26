import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
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

export function link<TInnerMarks extends LinkInnerMarks>(
  href: string,
  text?: TextInput<TInnerMarks>,
  title?: string
): FormattedTextItem<LinkMark | TInnerMarks> {
  return addMark(text ?? '', new LinkMark(href, title));
}

export class LinkMark implements IMark {
  constructor(public readonly href: string, public readonly title?: string) {}

  render(text: string, ctx: RenderContext): string {
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
