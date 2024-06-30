import { Block } from '../elements';
import type { Renderer } from '../renderer';

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
