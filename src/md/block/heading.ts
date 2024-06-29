import type { IBlock } from '../block';
import type { Renderer } from '../renderer';
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

  render(renderer: Renderer): string {
    return `${'#'.repeat(this.level)} ${renderer.renderText(this.text)}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: `h${this.level}`,
      content: renderer.renderTextAsHtml(this.text),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}
