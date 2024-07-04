import { Block, Mark } from '../elements';
import type { Renderer } from '../renderer';
import type { InlineText } from '../text';

export function footnote(text: InlineText, label?: string): FootnoteMark {
  return new FootnoteMark(text, label);
}

export class FootnoteMark extends Mark {
  constructor(
    public readonly text: InlineText,
    public readonly label?: string
  ) {
    super();
  }

  render(renderer: Renderer): string {
    const label =
      this.label || renderer.incrementCounter('footnotes').toString();
    renderer.appendBlock(new FootnoteBlock(this.text, label));
    return `[^${label}]`;
  }

  renderAsHtml(renderer: Renderer): string {
    return this.render(renderer);
  }
}

class FootnoteBlock extends Block {
  constructor(public readonly text: InlineText, public readonly label: string) {
    super();
  }

  render(renderer: Renderer): string {
    const text = renderer.renderText(this.text);
    const prefix = `[^${this.label}]:`;
    const indentedText = text
      .split('\n')
      .map((line, index) =>
        index > 0 && line ? `${' '.repeat(4)}${line}` : line
      )
      .join('\n');
    return `${prefix} ${indentedText}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return this.render(renderer);
  }
}
