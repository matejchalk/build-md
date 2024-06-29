import type { IBlock } from '../block';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

export function quote(text: BlockText): QuoteBlock {
  return new QuoteBlock(text);
}

export class QuoteBlock implements IBlock {
  constructor(public readonly text: BlockText) {}

  render(renderer: Renderer): string {
    const text = renderer.renderText(this.text);
    return text
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n');
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'blockquote',
      content: renderer.renderTextAsHtml(this.text),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}
