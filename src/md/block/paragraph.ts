import type { IBlock } from '../block';
import type { BlockText } from '../text';

export function paragraph(text: BlockText): ParagraphBlock {
  return new ParagraphBlock(text);
}

export class ParagraphBlock implements IBlock {
  constructor(public readonly text: BlockText) {}
}
