import { Mark } from '../elements';
import type { Renderer } from '../renderer';

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
