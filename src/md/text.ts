import type { Block, Element, Mark } from './elements';
import type { md } from './md';

export type TextWithElements<T extends Element> = string | T | (string | T)[];

/** Text which may contain inline formatting elements */
export type InlineText<TMark extends Mark = Mark> = TextWithElements<TMark>;

/** Text which may contain block or inline formatting elements */
export type BlockText<TBlock extends Block = Block> = TextWithElements<
  Mark | TBlock
>;

/** Text containing formatting elements, returned by {@link md} */
export type FormattedText<TElement extends Element = Element> = (
  | string
  | TElement
)[] & {
  toString(): string;
};
