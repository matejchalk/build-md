import type { IBlock } from '../block';
import type { RenderContext } from '../context';
import type { IMark } from '../mark';
import { renderInlineText, type InlineText } from '../text';

export function footnote(text: InlineText, label?: string): FootnoteMark {
  return new FootnoteMark(text, label);
}

export class FootnoteMark implements IMark {
  constructor(
    public readonly text: InlineText,
    public readonly label?: string
  ) {}

  render(ctx: RenderContext): string {
    const label = this.label || ctx.incrementCounter('footnotes').toString();
    ctx.appendBlock(new FootnoteBlock(this.text, label));
    return `[^${label}]`;
  }
}

class FootnoteBlock implements IBlock {
  constructor(
    public readonly text: InlineText,
    public readonly label: string
  ) {}

  render(ctx: RenderContext): string {
    const text = renderInlineText(this.text, ctx);
    return `[^${this.label}]: ${text}`;
  }
}
