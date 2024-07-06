import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

/**
 * Creates **paragraph**.
 *
 * @example
 * paragraph('Some text content.')
 * @example
 * paragraph(md`Some text content with ${bold('formatting')}.`)
 *
 * @param text plain string or text with inline or block formatting
 * @returns paragraph block
 * @see {@link MarkdownDocument.paragraph}
 */
export function paragraph(text: BlockText): ParagraphBlock {
  return new ParagraphBlock(text);
}

export class ParagraphBlock extends Block {
  constructor(public readonly text: BlockText) {
    super();
  }

  render(renderer: Renderer): string {
    return renderer.renderText(this.text);
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'p',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}
