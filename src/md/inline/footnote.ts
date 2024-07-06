import { Block, Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';

/**
 * Creates **footnote** label and registers content to be appended to document.
 *
 * Footnotes allow you to add notes and references without cluttering the body of the document.
 * When you create a footnote, a superscript number with a link appears where you added the footnote reference.
 * Readers can click the link to jump to the content of the footnote at the bottom of the page.
 *
 * @example
 * foonote('more info')
 * @example
 * footnote(md`more info with ${bold('extra formatting')}`)
 * @example
 * foonote('more info', 'customLabel')
 *
 * @param text plain string or text with inline formatting
 * @param label custom label for footnote link (default is auto-incremented number)
 * @returns footnote mark
 */
export function footnote(text: InlineText, label?: string): FootnoteMark {
  return new FootnoteMark(text, label);
}

export class FootnoteMark extends Mark {
  constructor(
    public readonly text: InlineText,
    public readonly label?: string
  ) {
    super();
  }

  render(renderer: Renderer): string {
    const label = this.#getLabel(renderer);
    renderer.appendBlock(new FootnoteBlock(this.text, label, false));
    return `[^${label}]`;
  }

  renderAsHtml(renderer: Renderer): string {
    const label = this.#getLabel(renderer);
    renderer.appendBlock(new FootnoteBlock(this.text, label, true));
    return renderer.renderHtmlElement({
      tag: 'a',
      attrs: { href: `#footnote-${label}` },
      content: `[${label}]`,
    });
  }

  #getLabel(renderer: Renderer): string {
    return this.label || renderer.incrementCounter('footnotes').toString();
  }
}

class FootnoteBlock extends Block {
  constructor(
    public readonly text: InlineText,
    public readonly label: string,
    public readonly isHtml: boolean
  ) {
    super();
  }

  render(renderer: Renderer): string {
    if (this.isHtml) {
      return this.renderAsHtml(renderer);
    }
    const content = renderer.renderText(this.text, { indentation: 4 });
    return `[^${this.label}]: ${content}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'p',
      attrs: { id: `footnote-${this.label}` },
      content: `[${this.label}] ${renderer.renderTextAsHtml(this.text)}`,
    });
  }
}
