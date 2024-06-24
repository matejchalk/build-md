import type {
  Block,
  ConditionalContent,
  HeadingLevel,
  InlineHelpers,
  InnerContent,
  ListBlock,
  ListItem,
  ListKind,
  TableColumn,
  TableRow,
} from './types';

type MarkdownDocumentOptions = {
  mutable?: boolean;
};

export class MarkdownDocument {
  #options: Required<MarkdownDocumentOptions>;

  #blocks: Block[] = [];

  #footnotes: { current: string[]; next: string[] } = { current: [], next: [] };

  #inlineHelpers: InlineHelpers = {
    bold: text => `**${text}**`,

    italic: text => `_${text}_`,

    strikethrough: text => `~${text}~`,

    link: (href, text) => `[${text}](${href})`,

    image: (src, alt) => `![${alt}](${src})`,

    code: text => `\`${text}\``,

    footnote: (text: string) => {
      this.#footnotes.next.push(text);
      const footnoteNumber =
        this.#footnotes.current.length + this.#footnotes.next.length;
      return `[^${footnoteNumber}]`;
    },
  };

  constructor(options?: MarkdownDocumentOptions) {
    this.#options = {
      mutable: false,
      ...options,
    };
  }

  heading(level: HeadingLevel, content: InnerContent): MarkdownDocument {
    const text = this.#format(content);
    if (!text) return this;
    return this.#append({ block: 'heading', level, text });
  }

  paragraph(content: InnerContent): MarkdownDocument {
    const text = this.#format(content);
    if (!text) return this;
    return this.#append({ block: 'paragraph', text });
  }

  list(items: ListItem): MarkdownDocument;
  list<TKind extends ListKind>(
    kind: TKind,
    items: ListItem<TKind>[]
  ): MarkdownDocument;
  list<TKind extends ListKind>(
    kindOrItems: TKind | ListItem<TKind>[],
    optionalItems?: ListItem<TKind>[]
  ): MarkdownDocument {
    const kind: ListKind = Array.isArray(kindOrItems)
      ? 'unordered'
      : kindOrItems;
    const sourceItems: ListItem<TKind>[] = Array.isArray(kindOrItems)
      ? kindOrItems
      : optionalItems ?? [];

    const items = sourceItems
      .map((item): ListItem<ListKind, string> | null => {
        const text = this.#format(Array.isArray(item) ? item[0] : item);
        if (!text) return null;
        return Array.isArray(item) ? [text, item[1]] : text;
      })
      .filter(item => item != null);

    if (items.length === 0) return this;
    return this.#append({ block: 'list', kind, items } as ListBlock);
  }

  code(content: InnerContent, lang?: string): MarkdownDocument {
    const text = this.#format(content);
    if (!text) return this;
    return this.#append({ block: 'code', ...(lang && { lang }), text });
  }

  quote(content: InnerContent): MarkdownDocument {
    const text = this.#format(content);
    if (!text) return this;
    return this.#append({ block: 'quote', text });
  }

  table(columns: string[] | TableColumn[], rows: TableRow[]): MarkdownDocument {
    if (columns.length === 0) return this;
    return this.#append({
      block: 'table',
      columns: columns.map(col =>
        typeof col === 'string' ? { heading: col } : col
      ),
      rows,
    });
  }

  #append(block: Block): MarkdownDocument {
    if (this.#options.mutable) {
      this.#blocks.push(block);
      this.#footnotes.current.push(...this.#footnotes.next);
      this.#footnotes.next.length = 0;
      return this;
    }

    const document = new MarkdownDocument(this.#options);
    document.#blocks = [...this.#blocks, block];
    document.#footnotes = {
      current: [...this.#footnotes.current, ...this.#footnotes.next],
      next: [],
    };
    return document;
  }

  #format(content: InnerContent): ConditionalContent {
    if (typeof content === 'function') {
      return content(this.#inlineHelpers);
    }
    return content;
  }
}
