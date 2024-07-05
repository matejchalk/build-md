import { Block, Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';

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
