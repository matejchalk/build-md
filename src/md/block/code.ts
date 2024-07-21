import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer } from '../renderer';

/**
 * Creates **code** block, without any syntax highlighting.
 *
 * @example
 * codeBlock('npm install build-md')
 *
 * @param text source as plain string (may be multiline)
 * @returns code block
 * @see {@link MarkdownDocument.code}
 */
export function codeBlock(text: string): CodeBlock;

/**
 * Creates **code** block with syntax highlighting.
 *
 * @example
 * codeBlock('ts', `function greet(name: string): void {
 *   console.log('Hello, ' + name + '!');
 * }`)
 *
 * @param lang programming language for syntax highlighting
 * @param text source as plain string (may be multiline)
 * @returns code block
 * @see {@link MarkdownDocument.code}
 */
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
        content: this.text.replace(/\n/g, '&#13;'),
      }),
    });
  }
}
