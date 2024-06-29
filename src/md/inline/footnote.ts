import type { IBlock } from '../block';
import type { IMark } from '../mark';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';

export function footnote(text: InlineText, label?: string): FootnoteMark {
  return new FootnoteMark(text, label);
}

export class FootnoteMark implements IMark {
  constructor(
    public readonly text: InlineText,
    public readonly label?: string
  ) {}

  render(renderer: Renderer): string {
    const label =
      this.label || renderer.incrementCounter('footnotes').toString();
    renderer.appendBlock(new FootnoteBlock(this.text, label));
    return `[^${label}]`;
  }

  renderAsHtml(renderer: Renderer): string {
    return this.render(renderer);
  }
}

class FootnoteBlock implements IBlock {
  constructor(
    public readonly text: InlineText,
    public readonly label: string
  ) {}

  render(renderer: Renderer): string {
    const text = renderer.renderInlineText(this.text);
    return `[^${this.label}]: ${text}`;
  }
}
