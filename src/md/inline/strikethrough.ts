import { Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';
import type { BoldMark } from './bold';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { ItalicMark } from './italic';
import type { LinkMark } from './link';

type StrikethroughInnerMarks =
  | BoldMark
  | CodeMark
  | FootnoteMark
  | ItalicMark
  | LinkMark;

/**
 * Creates **strikethrough** text - rendered with horizontal line through the middle.
 *
 * @example
 * strikethrough('cross this out')
 * @example
 * strikethrough(md`cross out this text with ${italic('extra formatting')}`)
 *
 * @param text plain string or text with inline formatting
 * @returns strikethrough mark
 */
export function strikethrough(
  text: InlineText<StrikethroughInnerMarks>
): StrikethroughMark {
  return new StrikethroughMark(text);
}

export class StrikethroughMark extends Mark {
  constructor(public readonly text: InlineText<StrikethroughInnerMarks>) {
    super();
  }

  render(renderer: Renderer): string {
    const text = renderer.renderText(this.text);
    return `~~${text}~~`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 's',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}
