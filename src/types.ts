export type ConditionalContent = string | null | undefined | false;
export type InnerContent = ConditionalContent | InlineFormatter;
export type InlineFormatter = (md: InlineHelpers) => ConditionalContent;

export type InlineHelpers = {
  bold(text: string): string;
  italic(text: string): string;
  strikethrough(text: string): string;
  link(href: string, text: string): string;
  image(src: string, alt: string): string;
  code(text: string): string;
  footnote(text: string): string;
};

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CodeBlock
  | QuoteBlock
  | TableBlock;

export type HeadingBlock = {
  block: 'heading';
  level: HeadingLevel;
  text: string;
};
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ParagraphBlock = {
  block: 'paragraph';
  text: string;
};

export type ListBlock<TKind extends ListKind = ListKind> = {
  block: 'list';
  kind: TKind;
  items: ListItem<TKind, string>;
};
export type ListKind = 'unordered' | 'ordered' | 'task';
export type ListItem<
  TKind extends ListKind = ListKind,
  TContent extends InnerContent = InnerContent
> = TKind extends 'task' ? TContent | [TContent, boolean] : TContent;

export type CodeBlock = {
  block: 'code';
  lang?: string;
  text: string;
};

export type QuoteBlock = {
  block: 'quote';
  text: string;
};

export type TableBlock = {
  block: 'table';
  columns: TableColumn[];
  rows: TableRow[];
};
export type TableAlignment = 'left' | 'center' | 'right';
export type TableColumn = {
  heading: string;
  alignment?: TableAlignment;
};
export type TableRow = string[];
