import { Renderer } from './renderer';

/** Markdown/HTML element */
export abstract class Element {
  /** Format element as Markdown string */
  abstract render(renderer: Renderer): string;
  /** Format element as HTML string */
  abstract renderAsHtml(renderer: Renderer): string;
  /** Format element as single-line Markdown/HTML string */
  abstract renderInline(renderer: Renderer): string;

  /** Render as Markdown string */
  toString(): string {
    return this.render(new Renderer());
  }
}

/** Markdown/HTML block element */
export abstract class Block extends Element {
  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}

/** Markdown/HTML inline element */
export abstract class Mark extends Element {
  renderInline(renderer: Renderer): string {
    return this.render(renderer);
  }
}
