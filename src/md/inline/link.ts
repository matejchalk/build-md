import { Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';
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

/**
 * Creates **link** element.
 *
 * @example
 * link('https://www.markdownguide.org/')
 * @example
 * link('https://www.markdownguide.org/', 'Markdown Guide')
 * @example
 * link('https://www.markdownguide.org/', 'this guide', 'Markdown Guide')
 *
 * @param href link URL
 * @param text display text for link (defaults to URL)
 * @param title tooltip when hovering over the link
 * @returns link mark
 */
export function link(
  href: string,
  text?: InlineText<LinkInnerMarks>,
  title?: string
): LinkMark {
  return new LinkMark(href, text, title);
}

export class LinkMark extends Mark {
  constructor(
    public readonly href: string,
    public readonly text?: InlineText<LinkInnerMarks>,
    public readonly title?: string
  ) {
    super();
  }

  render(renderer: Renderer): string {
    const text = this.text && renderer.renderText(this.text);
    if (!text && !this.title) {
      return `<${this.href}>`;
    }
    return `[${text || this.href}](${this.href}${
      this.title ? ` "${this.title}"` : ''
    })`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'a',
      attrs: { href: this.href, ...(this.title && { title: this.title }) },
      content: this.text ? renderer.renderTextAsHtml(this.text) : this.href,
    });
  }
}
