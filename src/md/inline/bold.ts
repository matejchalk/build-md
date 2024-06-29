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

export function bold<TInnerMarks extends BoldInnerMarks>(
  text: InlineText<TInnerMarks>
): BoldMark<TInnerMarks> {
  return new BoldMark<TInnerMarks>(text);
}

export class BoldMark<
  TInnerMarks extends BoldInnerMarks = BoldInnerMarks
> extends Mark {
  constructor(public readonly text: InlineText<TInnerMarks>) {
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
