import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';

export function code(text: string): CodeMark {
  return new CodeMark(text);
}

export class CodeMark implements IMark {
  constructor(public readonly text: string) {}

  render(ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'code', text: this.text });
    }
    return `\`\`\`${this.text}\`\`\``;
  }
}
