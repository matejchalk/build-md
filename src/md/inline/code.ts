import type { IMark } from '../mark';
import type { Renderer } from '../renderer';

export function code(text: string): CodeMark {
  return new CodeMark(text);
}

export class CodeMark implements IMark {
  constructor(public readonly text: string) {}

  render(_: Renderer): string {
    return `\`\`\`${this.text}\`\`\``;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'code',
      content: this.text,
    });
  }
}
