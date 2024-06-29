import type { IBlock } from './block';

export type RenderContext = {
  isHtmlOnly: boolean;
  isSingleLine: boolean;
  incrementCounter(name: string): number;
  appendBlock(block: IBlock): void;
};
