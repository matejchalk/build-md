import type { IBlock } from '../block';
import type { InlineText } from '../text';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function heading(level: HeadingLevel, text: InlineText): HeadingBlock {
  return new HeadingBlock(level, text);
}

export class HeadingBlock implements IBlock {
  constructor(
    public readonly level: HeadingLevel,
    public readonly text: InlineText
  ) {}
}
