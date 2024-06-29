import type { IBlock } from '../block';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

export function paragraph(text: BlockText): ParagraphBlock {
  return new ParagraphBlock(text);
}

export class ParagraphBlock implements IBlock {
  constructor(public readonly text: BlockText) {}

  render(renderer: Renderer): string {
    return renderer.renderText(this.text);
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'p',
      content: renderer.renderTextAsHtml(this.text),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}
