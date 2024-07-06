import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';

/** Heading level, for defining document hierarchy. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Creates **heading**.
 *
 * @example
 * heading(1, 'Top-level heading')
 * @example
 * heading(2, md`Sub-heading with ${code('inline formatting')}`)
 *
 * @param level heading level
 * @param text plain string or text with inline formatting
 * @returns heading block
 * @see {@link MarkdownDocument.heading}
 */
export function heading(level: HeadingLevel, text: InlineText): HeadingBlock {
  return new HeadingBlock(level, text);
}

export class HeadingBlock extends Block {
  constructor(
    public readonly level: HeadingLevel,
    public readonly text: InlineText
  ) {
    super();
  }

  render(renderer: Renderer): string {
    return `${'#'.repeat(this.level)} ${renderer.renderText(this.text)}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: `h${this.level}`,
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}
