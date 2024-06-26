import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem } from '../text';

export function code(text: string): FormattedTextItem<CodeMark> {
  return addMark(text, new CodeMark());
}

export class CodeMark implements IMark {
  render(text: string, ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({ tag: 'code', text });
    }
    return `\`\`\`${text}\`\`\``;
  }
}
