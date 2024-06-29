import type { Renderer } from './renderer';

interface IElement {
  render(renderer: Renderer): string;
  renderAsHtml(renderer: Renderer): string;
  renderInline(renderer: Renderer): string;
}

export abstract class Block implements IElement {
  abstract render(renderer: Renderer): string;
  abstract renderAsHtml(renderer: Renderer): string;

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}

export abstract class Mark implements IElement {
  abstract render(renderer: Renderer): string;
  abstract renderAsHtml(renderer: Renderer): string;

  renderInline(renderer: Renderer): string {
    return this.render(renderer);
  }
}
