import type { IBlock } from './block';
import type { RenderContext } from './context';
import type { IMark } from './mark';

type FormattedText<T> = string | T | (string | T)[];

export type InlineText<TMark extends IMark = IMark> = FormattedText<TMark>;

export type BlockText<TBlock extends IBlock = IBlock> = FormattedText<
  IMark | TBlock
>;

export function renderInlineText(text: InlineText, ctx: RenderContext): string {
  if (Array.isArray(text)) {
    return text.map(item => renderInlineText(item, ctx)).join('');
  }
  if (typeof text === 'string') {
    return text;
  }
  return text.render(ctx);
}
