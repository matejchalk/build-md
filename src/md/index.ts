import { codeBlock } from './block/code';
import { details } from './block/details';
import { heading } from './block/heading';
import { list } from './block/list';
import { paragraph } from './block/paragraph';
import { quote } from './block/quote';
import { rule } from './block/rule';
import { table } from './block/table';
import { bold } from './inline/bold';
import { code } from './inline/code';
import { footnote } from './inline/footnote';
import { image } from './inline/image';
import { italic } from './inline/italic';
import { link } from './inline/link';
import { strikethrough } from './inline/strikethrough';

import { md as mdFunction } from './md';

export const md = Object.assign(mdFunction, {
  // inline marks
  bold,
  italic,
  code,
  link,
  image,
  strikethrough,
  footnote,
  // block elements
  heading,
  paragraph,
  list,
  codeBlock,
  quote,
  rule,
  table,
  details,
});

export { Renderer } from './renderer';

export type { Conditional } from './conditional';
export type { Block, Mark } from './elements';
export type { BlockText, FormattedText, InlineText } from './text';

export { CodeBlock } from './block/code';
export { DetailsBlock } from './block/details';
export { HeadingBlock, type HeadingLevel } from './block/heading';
export {
  OrderedListBlock,
  TaskListBlock,
  UnorderedListBlock,
  type ListKind,
} from './block/list';
export { ParagraphBlock } from './block/paragraph';
export { QuoteBlock } from './block/quote';
export { RuleBlock } from './block/rule';
export {
  TableBlock,
  type TableCellAlignment,
  type TableColumn,
  type TableColumnObject,
  type TableRow,
} from './block/table';

export { BoldMark } from './inline/bold';
export { CodeMark } from './inline/code';
export { FootnoteMark } from './inline/footnote';
export { ImageMark } from './inline/image';
export { ItalicMark } from './inline/italic';
export { LinkMark } from './inline/link';
export { StrikethroughMark } from './inline/strikethrough';
