import type { IBlock } from '../block';
import type { BlockText } from '../text';

export function quote(text: BlockText): QuoteBlock {
  return new QuoteBlock(text);
}

export class QuoteBlock implements IBlock {
  constructor(public readonly text: BlockText) {}
}
