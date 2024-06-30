import {
  Renderer,
  md,
  type Block,
  type BlockText,
  type HeadingLevel,
  type InlineText,
  type ListKind,
  type TableCellAlignment,
} from './md';

type Conditional<T> = T | null | undefined | false;

type MarkdownDocumentOptions = {
  mutable?: boolean;
};

export class MarkdownDocument {
  #options: Required<MarkdownDocumentOptions>;
  #blocks: Block[] = [];

  constructor(options?: MarkdownDocumentOptions) {
    this.#options = {
      mutable: false,
      ...options,
    };
  }

  heading(
    level: HeadingLevel,
    text: Conditional<InlineText>
  ): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.heading(level, text));
  }

  paragraph(text: Conditional<BlockText>): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.paragraph(text));
  }

  list(items: BlockText[]): MarkdownDocument;
  list(kind: 'unordered', items: BlockText[]): MarkdownDocument;
  list(kind: 'ordered', items: BlockText[]): MarkdownDocument;
  list(kind: 'task', items: [boolean, BlockText][]): MarkdownDocument;
  list(
    kindOrItems: ListKind | (BlockText | [boolean, BlockText])[],
    optionalItems?: (BlockText | [boolean, BlockText])[]
  ): MarkdownDocument {
    const items = Array.isArray(kindOrItems) ? kindOrItems : optionalItems;
    if (!items?.length) return this;
    return this.#append(
      md.list(
        ...([kindOrItems, optionalItems] as Parameters<(typeof md)['list']>)
      )
    );
  }

  code(text: Conditional<string>): MarkdownDocument;
  code(lang: string, text: Conditional<string>): MarkdownDocument;
  code(
    langOrText: Conditional<string>,
    optionalText?: Conditional<string>
  ): MarkdownDocument {
    const text = optionalText ?? langOrText;
    const lang = optionalText ? langOrText : undefined;
    if (!text) return this;
    return this.#append(lang ? md.codeBlock(lang, text) : md.codeBlock(text));
  }

  quote(text: Conditional<BlockText>): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.quote(text));
  }

  rule(): MarkdownDocument {
    return this.#append(md.rule());
  }

  table(
    columns:
      | BlockText[]
      | { heading: BlockText; alignment?: TableCellAlignment }[],
    rows: BlockText[][]
  ): MarkdownDocument {
    if (columns.length === 0) return this;
    return this.#append(md.table(columns, rows));
  }

  details(text: Conditional<BlockText>): MarkdownDocument;
  details(summary: InlineText, text: Conditional<BlockText>): MarkdownDocument;
  details(
    summaryOrText: InlineText | Conditional<BlockText>,
    optionalText?: Conditional<BlockText>
  ): MarkdownDocument {
    const text = optionalText ?? summaryOrText;
    const summary = optionalText && summaryOrText ? summaryOrText : '';
    if (!text) return this;
    return this.#append(md.details(summary, text));
  }

  toString(): string {
    return new Renderer().renderDocument(this.#blocks);
  }

  #append(block: Block): MarkdownDocument {
    if (this.#options.mutable) {
      this.#blocks.push(block);
      return this;
    }

    const document = new MarkdownDocument(this.#options);
    document.#blocks = [...this.#blocks, block];
    return document;
  }
}
