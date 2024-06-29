import type { IBlock } from './block';
import type { IMark } from './mark';

type FormattedText<T> = string | T | (string | T)[];

export type InlineText<TMark extends IMark = IMark> = FormattedText<TMark>;

export type BlockText<TBlock extends IBlock = IBlock> = FormattedText<
  IMark | TBlock
>;
