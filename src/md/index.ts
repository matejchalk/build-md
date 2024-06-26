import { bold } from './inline/bold';
import { code } from './inline/code';
import { footnote } from './inline/footnote';
import { image } from './inline/image';
import { italic } from './inline/italic';
import { link } from './inline/link';
import { strikethrough } from './inline/strikethrough';

import { md as mdFunction } from './md';

export const md = Object.assign(mdFunction, {
  bold,
  italic,
  code,
  link,
  image,
  strikethrough,
  footnote,
});
