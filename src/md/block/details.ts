import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { BlockText, InlineText } from '../text';

export function details(text: BlockText): DetailsBlock;
export function details(summary: InlineText, text: BlockText): DetailsBlock;
export function details(
  summaryOrText: InlineText | BlockText,
  optionalText?: BlockText
): DetailsBlock {
  const summary = optionalText ? summaryOrText : '';
  const details = optionalText ?? summaryOrText;
  return new DetailsBlock(details, new SummaryBlock(summary));
}

export class DetailsBlock extends Block {
  constructor(
    public readonly text: BlockText,
    public readonly summary: SummaryBlock
  ) {
    super();
  }

  render(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'details',
      content: [
        this.summary.render(renderer),
        `\n${renderer.renderText(this.text)}\n`,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'details',
      content: [
        this.summary.renderAsHtml(renderer),
        renderer.renderTextAsHtml(this.text),
      ],
    });
  }
}

export class SummaryBlock extends Block {
  constructor(public readonly text: InlineText) {
    super();
  }

  render(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }

  renderAsHtml(renderer: Renderer): string {
    return (
      this.text &&
      renderer.renderHtmlElement({
        tag: 'summary',
        content: renderer.renderTextAsHtml(this.text),
      })
    );
  }
}
