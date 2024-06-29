import type { IMark } from '../mark';
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

export function strikethrough(
  text: InlineText<StrikethroughInnerMarks>
): StrikethroughMark {
  return new StrikethroughMark(text);
}

export class StrikethroughMark implements IMark {
  constructor(public readonly text: InlineText<StrikethroughInnerMarks>) {}

  render(renderer: Renderer): string {
    const text = renderer.renderInlineText(this.text);
    return `~~${text}~~`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 's',
      content: renderer.renderInlineTextAsHtml(this.text),
    });
  }
}
