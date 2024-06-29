import type { Block, Mark } from './elements';

type FormattedText<T> = string | T | (string | T)[];

export type InlineText<TMark extends Mark = Mark> = FormattedText<TMark>;

export type BlockText<TBlock extends Block = Block> = FormattedText<
  Mark | TBlock
>;
