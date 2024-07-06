import type { Block, Mark } from './elements';

type FormattedText<T> = string | T | (string | T)[];

/** Text which may contain inline formatting elements */
export type InlineText<TMark extends Mark = Mark> = FormattedText<TMark>;

/** Text which may contain block or inline formatting elements */
export type BlockText<TBlock extends Block = Block> = FormattedText<
  Mark | TBlock
>;
