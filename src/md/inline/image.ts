import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import { addMark, type IMark } from '../mark';
import type { FormattedTextItem } from '../text';

export function image(src: string, alt: string): FormattedTextItem<ImageMark> {
  return addMark('', new ImageMark(src, alt));
}

export class ImageMark implements IMark {
  constructor(public readonly src: string, public readonly alt: string) {}

  render(_: string, ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({
        tag: 'img',
        attrs: { src: this.src, alt: this.alt },
      });
    }
    return `![${this.alt}](${this.src})`;
  }
}
