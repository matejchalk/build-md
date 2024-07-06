import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer } from '../renderer';

/**
 * Creates **horizontal rule**.
 *
 * @example
 * rule()
 *
 * @returns rule block
 * @see {@link MarkdownDocument.rule}
 */
export function rule(): RuleBlock {
  return new RuleBlock();
}

export class RuleBlock extends Block {
  render(_: Renderer): string {
    return '---';
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({ tag: 'hr' });
  }
}
