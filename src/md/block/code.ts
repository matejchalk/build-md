import type { IBlock } from '../block';

export function codeBlock(text: string, lang?: string): CodeBlock {
  return new CodeBlock(text, lang);
}

export class CodeBlock implements IBlock {
  constructor(public readonly text: string, public readonly lang?: string) {}
}
