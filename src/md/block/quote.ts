import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

export function quote(text: BlockText): QuoteBlock {
  return new QuoteBlock(text);
}

export class QuoteBlock extends Block {
  constructor(public readonly text: BlockText) {
    super();
  }

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
}
