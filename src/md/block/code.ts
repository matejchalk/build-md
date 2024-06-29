import type { IBlock } from '../block';
import type { Renderer } from '../renderer';

export function codeBlock(text: string, lang?: string): CodeBlock {
  return new CodeBlock(text, lang);
}

export class CodeBlock implements IBlock {
  constructor(public readonly text: string, public readonly lang?: string) {}

  render(_: Renderer): string {
    const backticks = '```';
    return [`${backticks}${this.lang ?? ''}`, this.text, backticks].join('\n');
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'pre',
      content: renderer.renderHtmlElement({
        tag: 'code',
        content: this.text,
      }),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}
