import { Mark } from '../elements';
import type { Renderer } from '../renderer';

/**
 * Creates inline **code**.
 *
 * @example
 * code('console.log("Hello, world!")')
 *
 * @param text source code as plain string
 * @returns code mark
 */
export function code(text: string): CodeMark {
  return new CodeMark(text);
}

export class CodeMark extends Mark {
  constructor(public readonly text: string) {
    super();
  }

  render(_: Renderer): string {
    return `\`${this.text}\``;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'code',
      content: this.text,
    });
  }
}
