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

/** {@inheritDoc mdFunction} */
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

export type { Block, Mark } from './elements';
export type { BlockText, InlineText } from './text';

export type { HeadingLevel } from './block/heading';
export type { ListKind } from './block/list';
export type { TableCellAlignment } from './block/table';
