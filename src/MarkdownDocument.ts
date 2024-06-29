import {
  md,
  type HeadingLevel,
  type ListKind,
  type TableCellAlignment,
} from './md';
import type { IBlock } from './md/block';
import type { BlockText, InlineText } from './md/text';

type Conditional<T> = T | null | undefined | false;

type MarkdownDocumentOptions = {
  mutable?: boolean;
};

export class MarkdownDocument {
  #options: Required<MarkdownDocumentOptions>;
  #blocks: IBlock[] = [];

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

  code(text: Conditional<string>, lang?: string): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.codeBlock(text, lang));
  }

  quote(text: Conditional<BlockText>): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.quote(text));
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

  #append(block: IBlock): MarkdownDocument {
    if (this.#options.mutable) {
      this.#blocks.push(block);
      return this;
    }

    const document = new MarkdownDocument(this.#options);
    document.#blocks = [...this.#blocks, block];
    return document;
  }
}
