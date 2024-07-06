import type { Renderer } from './renderer';

/** Markdown/HTML element */
export interface IElement {
  /** Format element as Markdown string */
  render(renderer: Renderer): string;
  /** Format element as HTML string */
  renderAsHtml(renderer: Renderer): string;
  /** Format element as single-line Markdown/HTML string */
  renderInline(renderer: Renderer): string;
}

/** Markdown/HTML block element */
export abstract class Block implements IElement {
  abstract render(renderer: Renderer): string;
  abstract renderAsHtml(renderer: Renderer): string;

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}

/** Markdown/HTML inline element */
export abstract class Mark implements IElement {
  abstract render(renderer: Renderer): string;
  abstract renderAsHtml(renderer: Renderer): string;

  renderInline(renderer: Renderer): string {
    return this.render(renderer);
  }
}
