import type { Block } from './elements';
import type { BlockText, InlineText } from './text';

export class Renderer {
  readonly #counters = new Map<string, number>();
  readonly #extraBlocks: Block[] = [];

  renderDocument(blocks: Block[]): string {
    let blocksToRender = blocks;
    const renderedBlocks: string[] = [];

    while (blocksToRender.length > 0) {
      this.#extraBlocks.length = 0;
      renderedBlocks.push(...blocksToRender.map(block => block.render(this)));
      blocksToRender = this.#extraBlocks;
    }

    return renderedBlocks.filter(Boolean).join('\n\n') + '\n';
  }

  renderText(text: InlineText | BlockText): string {
    return this.#render(text, 'markdown');
  }

  renderTextAsHtml(text: InlineText | BlockText): string {
    return this.#render(text, 'html');
  }

  renderInline(text: InlineText | BlockText): string {
    return this.#render(text, 'inline');
  }

  #render(
    text: InlineText | BlockText,
    mode: 'markdown' | 'inline' | 'html'
  ): string {
    if (Array.isArray(text)) {
      return text.map(item => this.#render(item, mode)).join('');
    }
    if (typeof text === 'string') {
      return text;
    }

    switch (mode) {
      case 'markdown':
        return text.render(this);
      case 'html':
        return text.renderAsHtml(this);
      case 'inline':
        return text.renderInline(this);
    }
  }

  renderHtmlElement({ tag, attrs, content }: HtmlElement): string {
    const attributes = Object.entries(attrs ?? {})
      .map(([key, value]) =>
        typeof value === 'boolean'
          ? value
            ? ` ${key}`
            : ''
          : ` ${key}="${value}"`
      )
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

  appendBlock(block: Block): void {
    this.#extraBlocks.push(block);
  }

  get extraBlocks(): Block[] {
    return this.#extraBlocks;
  }
}

type HtmlElement = {
  tag: string;
  attrs?: Record<string, string | boolean>;
  content?: string | HtmlElement | HtmlElement[];
};
