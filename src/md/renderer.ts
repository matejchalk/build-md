import type { IBlock } from './block';
import type { InlineText } from './text';

export class Renderer {
  readonly #counters = new Map<string, number>();
  readonly #extraBlocks: IBlock[] = [];

  renderInlineText(text: InlineText, isHtml = false): string {
    if (Array.isArray(text)) {
      return text.map(item => this.renderInlineText(item, isHtml)).join('');
    }
    if (typeof text === 'string') {
      return text;
    }
    if (isHtml) {
      return text.renderAsHtml(this);
    }
    return text.render(this);
  }

  renderInlineTextAsHtml(text: InlineText): string {
    return this.renderInlineText(text, true);
  }

  renderHtmlElement({ tag, attrs, content }: HtmlElement): string {
    const attributes = Object.entries(attrs ?? {})
      .map(([key, value]) => ` ${key}="${value}"`)
      .join('');

    if (!content) {
      return `<${tag}${attributes} />`;
    }

    const text: string = Array.isArray(content)
      ? content.map(el => this.renderHtmlElement(el)).join('')
      : typeof content === 'object'
      ? this.renderHtmlElement(content)
      : content;
    return `<${tag}${attributes}>${text}</${tag}>`;
  }

  incrementCounter(name: string): number {
    const oldValue = this.#counters.get(name) ?? 0;
    const newValue = oldValue + 1;
    this.#counters.set(name, newValue);
    return newValue;
  }

  appendBlock(block: IBlock): void {
    this.#extraBlocks.push(block);
  }

  get extraBlocks(): IBlock[] {
    return this.#extraBlocks;
  }
}

type HtmlElement = {
  tag: string;
  attrs?: Record<string, string>;
  content?: string | HtmlElement | HtmlElement[];
};
