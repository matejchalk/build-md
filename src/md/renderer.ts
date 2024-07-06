import { Block } from './elements';
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
      blocksToRender = [...this.#extraBlocks];
    }

    return renderedBlocks.filter(Boolean).join('\n\n') + '\n';
  }

  renderText(
    text: InlineText | BlockText,
    options?: RenderMarkdownOptions
  ): string {
    return this.#render(text, 'markdown', options);
  }

  renderTextAsHtml(text: InlineText | BlockText): string {
    return this.#render(text, 'html');
  }

  renderInline(text: InlineText | BlockText): string {
    return this.#render(text, 'inline');
  }

  #render(
    text: InlineText | BlockText,
    mode: 'markdown' | 'inline' | 'html',
    options?: RenderMarkdownOptions
  ): string {
    const indent = options?.indentation ? ' '.repeat(options.indentation) : '';

    if (Array.isArray(text)) {
      return text
        .map((item, index) => {
          const str = this.#render(item, mode, options);
          if (mode === 'markdown' && item instanceof Block && index > 0) {
            if (
              options?.attachableBlocks?.some(block => item instanceof block)
            ) {
              return `\n${indent}${str}`;
            }
            return `\n\n${indent}${str}`;
          }
          return str;
        })
        .join('');
    }
    if (typeof text === 'string') {
      return text;
    }

    switch (mode) {
      case 'markdown':
        const str = text.render(this);
        if (indent) {
          return str
            .split('\n')
            .map((line, index) => (index > 0 ? `${indent}${line}` : line))
            .join('\n');
        }
        return str;

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
      ? content
          .map(el => (typeof el === 'string' ? el : this.renderHtmlElement(el)))
          .join('')
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

type Constructor<T = any> = {
  new (...args: any[]): T;
};

export type RenderMarkdownOptions = {
  attachableBlocks?: Constructor<Block>[];
  indentation?: number;
};

export type HtmlElement = {
  tag: string;
  attrs?: Record<string, string | boolean>;
  content?: string | HtmlElement | (string | HtmlElement)[];
};
