import type { RenderContext } from '../context';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';

export function footnote(
  text: TextInput,
  label?: string
): FormattedTextItem<FootnoteMark | IMark> {
  return addMark(text, new FootnoteMark(label));
}

export class FootnoteMark implements IMark {
  constructor(public readonly label?: string) {}

  render(text: string, ctx: RenderContext): string {
    const label = this.label || ctx.generateFootnoteLabel();
    ctx.registerFootnote(label, text);
    return `[^${label}]`;
  }

  static renderText(label: string, text: string): string {
    return `[^${label}]: ${text}`;
  }
}
