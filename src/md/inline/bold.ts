import { Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { ItalicMark } from './italic';
import type { LinkMark } from './link';
import type { StrikethroughMark } from './strikethrough';

type BoldInnerMarks =
  | CodeMark
  | FootnoteMark
  | ItalicMark
  | LinkMark
  | StrikethroughMark;

/**
 * Creates **bold** text.
 *
 * @example
 * bold('this is important')
 * @example
 * bold(md`important text with ${italic('extra formatting')}`)
 *
 * @param text plain string or text with inline formatting
 * @returns bold mark
 */
export function bold(text: InlineText<BoldInnerMarks>): BoldMark {
  return new BoldMark(text);
}

export class BoldMark extends Mark {
  constructor(public readonly text: InlineText<BoldInnerMarks>) {
    super();
  }

  render(renderer: Renderer): string {
    const text = renderer.renderText(this.text);
    return `**${text}**`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'b',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}
