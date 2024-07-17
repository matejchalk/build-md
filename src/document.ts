import {
  Renderer,
  md,
  type Block,
  type BlockText,
  type Conditional,
  type HeadingLevel,
  type InlineText,
  type ListKind,
  type TableColumn,
  type TableRow,
} from './md';

/** Options for customizing {@link MarkdownDocument} behaviour. */
type MarkdownDocumentOptions = {
  /** Should methods calls modify the original {@link MarkdownDocument} instance (`true`), or return a new instance (`false` by default). */
  mutable?: boolean;
};

/**
 * Builder for Markdown documents.
 *
 * @see {@link md} for creating inline Markdown texts
 */
export class MarkdownDocument {
  #options: Required<MarkdownDocumentOptions>;
  #blocks: Block[] = [];

  /**
   * Creates instance for building a Markdown document.
   *
   * @param options Customization options (e.g. mutability).
   */
  constructor(options?: MarkdownDocumentOptions) {
    this.#options = {
      mutable: false,
      ...options,
    };
  }

  /**
   * Adds **heading** to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .heading(1, 'Top-level heading')
   *   .heading(2, md`Sub-heading with ${code('inline formatting')}`)
   *
   * @param level heading level
   * @param text plain string or text with inline formatting
   * @returns document with additional heading block
   * @see {@link md.heading}
   */
  heading(
    level: HeadingLevel,
    text: Conditional<InlineText>
  ): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.heading(level, text));
  }

  /**
   * Adds **paragraph** to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .paragraph('Some text content.')
   *   .paragraph(md`Some text content with ${bold('formatting')}.`)
   *
   * @param text plain string or text with inline or block formatting
   * @returns document with additional paragraph block
   * @see {@link md.paragraph}
   */
  paragraph(text: Conditional<BlockText>): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.paragraph(text));
  }

  /**
   * Adds **unordered list** to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .list(['first item', 'second item'])
   *   .list([
   *     md`first item with ${italic('text formatting')}`,
   *     md`second item with nested list:${md.list([
   *      "second item's first item",
   *      "second item's second item"
   *     ])}`
   *   ])
   *
   * @param items array of items, each of which may contain block or inline formatting
   * @returns document with additional unordered list block
   * @see {@link md.list}
   */
  list(items: Conditional<BlockText[]>): MarkdownDocument;

  /**
   * Adds **unordered list** to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .list('unordered', ['first item', 'second item'])
   *   .list('unordered', [
   *     md`first item with ${italic('text formatting')}`,
   *     md`second item with nested list:${md.list('unordered', [
   *      "second item's first item",
   *      "second item's second item"
   *     ])}`
   *   ])
   *
   * @param kind type of list (may be ommitted since `'unordered'` is the default)
   * @param items array of items, each of which may contain block or inline formatting
   * @returns document with additional unordered list block
   * @see {@link md.list}
   */
  list(kind: 'unordered', items: Conditional<BlockText[]>): MarkdownDocument;

  /**
   * Adds **ordered list** to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .list('ordered', ['first item', 'second item'])
   *   .list('ordered', [
   *     md`first item with ${italic('text formatting')}`,
   *     md`second item with nested list:${md.list('ordered', [
   *      "second item's first item",
   *      "second item's second item"
   *     ])}`
   *   ])
   *
   * @param kind type of list
   * @param items array of items, each of which may contain block or inline formatting
   * @returns document with additional ordered list block
   * @see {@link md.list}
   */
  list(kind: 'ordered', items: Conditional<BlockText[]>): MarkdownDocument;

  /**
   * Adds **task list** to document (unless empty). Also known as _checklist_ or _todo_ list.
   *
   * Part of extended Markdown syntax, not supported by all Markdown processors.
   *
   * @example
   * new MarkdownDocument().list('task', [
   *   [true, 'first task is done'],
   *   [false, 'second task is done']
   * ])
   *
   * @param kind type of list
   * @param items array of items, each of which is a tuple of checked state and text (plain or with formatting)
   * @returns document with additional task list block
   * @see {@link md.list}
   */
  list(
    kind: 'task',
    items: Conditional<[boolean, BlockText][]>
  ): MarkdownDocument;

  list(
    kindOrItems: ListKind | Conditional<(BlockText | [boolean, BlockText])[]>,
    optionalItems?: Conditional<(BlockText | [boolean, BlockText])[]>
  ): MarkdownDocument {
    const items = Array.isArray(kindOrItems) ? kindOrItems : optionalItems;
    if (!items || !items.length) return this;
    return this.#append(
      md.list(
        ...([kindOrItems, optionalItems] as Parameters<(typeof md)['list']>)
      )
    );
  }

  /**
   * Adds **code** block to document (unless empty), without any syntax highlighting.
   *
   * @example
   * new MarkdownDocument().code('npm install build-md')
   *
   * @param text source as plain string (may be multiline)
   * @returns document with additional code block
   * @see {@link md.code}
   */
  code(text: Conditional<string>): MarkdownDocument;

  /**
   * Adds **code** block to document (unless empty), with syntax highlighting.
   *
   * @example
   * new MarkdownDocument().code('ts', `function greet(name: string): void {
   *   console.log('Hello, ' + name + '!');
   * }`)
   *
   * @param lang programming language for syntax highlighting
   * @param text source as plain string (may be multiline)
   * @returns document with additional code block
   * @see {@link md.code}
   */
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

  /**
   * Adds **quote** block to document (unless empty).
   *
   * @example
   * new MarkdownDocument()
   *   .quote('Some quoted text.')
   *   .quote(md`Some quoted text with ${bold('formatting')}.`)
   *
   * @param text plain string or text with inline or block formatting
   * @returns document with additional quote block
   * @see {@link md.quote}
   */
  quote(text: Conditional<BlockText>): MarkdownDocument {
    if (!text) return this;
    return this.#append(md.quote(text));
  }

  /**
   * Adds **horizontal rule** to document.
   *
   * @example
   * new MarkdownDocument().rule()
   *
   * @returns document with additional rule block
   * @see {@link md.rule}
   */
  rule(): MarkdownDocument {
    return this.#append(md.rule());
  }

  /**
   * Adds **table** to document (unless no columns).
   *
   * Part of extended Markdown syntax, not supported by all Markdown processors.
   *
   * @example
   * new MarkdownDocument().table(['x', 'y'], [['0', '0'], ['5', '20']])
   * @example
   * new MarkdownDocument().table(
   *   [
   *     { heading: 'Error', alignment: 'left' },
   *     { heading: link('./environments.md', 'Environment'), alignment: 'center' },
   *     { heading: 'Occurrences', alignment: 'right' },
   *   ],
   *   [
   *     [
   *       code("TypeError: Cannot read properties of undefined (reading 'push')"),
   *       'production',
   *       '19',
   *     ],
   *     [
   *       code("TypeError: Cannot read properties of null (reading '0')"),
   *       'staging',
   *       '5',
   *     ],
   *   ]
   * )
   *
   * @param columns table header - column heading texts with optional column alignments
   * @param rows table body - rows with text content for column cells
   * @returns document with additional table block
   * @see {@link md.table}
   */
  table(columns: TableColumn[], rows: TableRow[]): MarkdownDocument {
    if (columns.length === 0) return this;
    return this.#append(md.table(columns, rows));
  }

  /**
   * Adds expandable **details** element (unless empty) to document, without custom summary text.
   *
   * Not part of Markdown syntax, relies on support for HTML rendering.
   *
   * @example
   * new MarkdownDocument()
   *   .details('text hidden until expanded')
   *   .details(md`text with ${bold('inline')} and ${list(['block'])} elements.`)
   *
   * @param text plain string, text with inline or block formatting, or another document
   * @returns document with additional details block
   * @see {@link md.details}
   */
  details(text: Conditional<BlockText | MarkdownDocument>): MarkdownDocument;

  /**
   * Adds expandable **details** element (unless empty) to document, with custom **summary** text.
   *
   * Not part of Markdown syntax, relies on support for HTML rendering.
   *
   * @example
   * new MarkdownDocument()
   *   .details('summary text always shown', 'text hidden until expanded')
   *   .details(
   *     md`summary text with ${italic('inline')} formatting`,
   *     md`text with ${bold('inline')} and ${list(['block'])} elements.`
   *   )
   *
   * @param summary plain string or text with inline formatting
   * @param text plain string, text with inline or block formatting, or another document
   * @returns document with additional details block
   * @see {@link md.details} method
   */
  details(
    summary: InlineText,
    text: Conditional<BlockText | MarkdownDocument>
  ): MarkdownDocument;

  details(
    summaryOrText: InlineText | Conditional<BlockText>,
    optionalText?: Conditional<BlockText | MarkdownDocument>
  ): MarkdownDocument {
    const text = optionalText ?? summaryOrText;
    const summary = optionalText && summaryOrText ? summaryOrText : '';
    if (!text) return this;
    return this.#append(
      md.details(
        summary,
        text instanceof MarkdownDocument ? text.#blocks : text
      )
    );
  }

  /**
   * Conditionally adds elements to document using callback function.
   *
   * Convenient when multiple elements are subject to same conditional logic.
   *
   * @example
   * new MarkdownDocument()
   *   .$if(
   *     shouldIncludeFooter(),
   *     doc => doc.rule().paragraph('Some footer content.')
   *   )
   * @example
   * new MarkdownDocument()
   *   .$if(
   *     items.length > 0,
   *     doc => doc.paragraph(`${items.length} items found:`).list(items),
   *     doc => doc.paragraph('No items found.')
   *   )
   *
   * @param condition boolean predicate - if `true` then {@link ifFn} is used, if `false` then either {@link elseFn} is used or nothing is changed
   * @param ifFn callback used when {@link condition} is `true`, receives current document and should return modified document
   * @param elseFn optional callback used when {@link condition} is `false`, receives current document and should return modified document
   * @returns document with or without additional blocks based on condition
   */
  $if(
    condition: boolean,
    ifFn: (document: MarkdownDocument) => MarkdownDocument,
    elseFn?: (document: MarkdownDocument) => MarkdownDocument
  ): MarkdownDocument {
    if (condition) {
      return ifFn(this);
    }
    return elseFn?.(this) ?? this;
  }

  /**
   * Iteratively adds element to document using callback function.
   *
   * Convenient when multiple elements need be added dynamically per item in array.
   *
   * @example
   * new MarkdownDocument().$foreach(
   *   sections,
   *   (doc, section) => doc.heading(2, section.title).paragraph(section.content)
   * )
   *
   * @template T type of each array item
   * @param items array of items to be iterated over
   * @param eachFn callback invoked for every item in {@link items}, receives current document and should return modified document
   * @returns document with additional blocks from each array item
   */
  $foreach<T>(
    items: T[],
    eachFn: (document: MarkdownDocument, item: T) => MarkdownDocument
  ): MarkdownDocument {
    return items.reduce<MarkdownDocument>(
      (acc, item) => eachFn(acc, item),
      this
    );
  }

  /**
   * Add all blocks from another document.
   *
   * Useful for reusing code.
   *
   * @example
   * const footerDoc = new MarkdownDocument().rule().paragraph('Some footer content.')
   * const mainDoc = new MarkdownDocument()
   *   // ... add main blocks ...
   *   .$concat(footerDoc)
   *
   *
   * @param document other document
   * @returns document extended by additional blocks
   */
  $concat(document: Conditional<MarkdownDocument>): MarkdownDocument;

  /**
   * Add all blocks from multiple other documents.
   *
   * Useful for reusing code.
   *
   * @example
   * const intro = new MarkdownDocument().heading(1, 'Main title').paragraph('Some text.')
   * const chapter1 = new MarkdownDocument().heading(2, 'Chapter title').paragraph('Some text.')
   * const chapter2 = new MarkdownDocument().heading(2, 'Chapter title').paragraph('Some text.')
   * const conclusion = new MarkdownDocument().heading(2, 'Conclusion').paragraph('Some text.')
   *
   * new MarkdownDocument()
   *   .$concat(intro, chapter1, chapter2, conclusion)
   *
   * @param documents other documents
   * @returns document extended by additional blocks
   */
  $concat(
    ...documents: [
      Conditional<MarkdownDocument>,
      Conditional<MarkdownDocument>,
      ...Conditional<MarkdownDocument>[]
    ]
  ): MarkdownDocument;

  $concat(
    ...documents: [
      Conditional<MarkdownDocument>,
      ...Conditional<MarkdownDocument>[]
    ]
  ): MarkdownDocument {
    return this.#extend(
      documents
        .filter(doc => doc instanceof MarkdownDocument)
        .flatMap(doc => doc.#blocks)
    );
  }

  /**
   * Renders document to Markdown.
   *
   * @returns Markdown string
   */
  toString(): string {
    return new Renderer().renderDocument(this.#blocks);
  }

  #append(block: Block): MarkdownDocument {
    return this.#extend([block]);
  }

  #extend(blocks: Block[]): MarkdownDocument {
    if (this.#options.mutable) {
      this.#blocks.push(...blocks);
      return this;
    }

    const document = new MarkdownDocument(this.#options);
    document.#blocks = [...this.#blocks, ...blocks];
    return document;
  }
}
