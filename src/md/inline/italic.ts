import type { IMark } from '../mark';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';
import type { BoldMark } from './bold';
import type { CodeMark } from './code';
import type { FootnoteMark } from './footnote';
import type { LinkMark } from './link';
import type { StrikethroughMark } from './strikethrough';

type ItalicInnerMarks =
  | BoldMark
  | CodeMark
  | FootnoteMark
  | LinkMark
  | StrikethroughMark;

export function italic(text: InlineText<ItalicInnerMarks>): ItalicMark {
  return new ItalicMark(text);
}

export class ItalicMark implements IMark {
  constructor(public readonly text: InlineText<ItalicInnerMarks>) {}

  render(renderer: Renderer): string {
    const text = renderer.renderInlineText(this.text);
    return `_${text}_`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'i',
      content: renderer.renderInlineTextAsHtml(this.text),
    });
  }
}
