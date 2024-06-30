import { Block } from '../elements';
import type { Renderer } from '../renderer';

export function codeBlock(text: string): CodeBlock;
export function codeBlock(lang: string, text: string): CodeBlock;
export function codeBlock(
  langOrText: string,
  optionalText?: string
): CodeBlock {
  const text = optionalText ?? langOrText;
  const lang = optionalText ? langOrText : undefined;
  return new CodeBlock(text, lang);
}

export class CodeBlock extends Block {
  constructor(public readonly text: string, public readonly lang?: string) {
    super();
  }

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
}
