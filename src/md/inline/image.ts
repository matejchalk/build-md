import type { RenderContext } from '../context';
import { renderHtml } from '../html';
import type { IMark } from '../mark';

export function image(src: string, alt: string): ImageMark {
  return new ImageMark(src, alt);
}

export class ImageMark implements IMark {
  constructor(public readonly src: string, public readonly alt: string) {}

  render(ctx: RenderContext): string {
    if (ctx.isHtmlOnly) {
      return renderHtml({
        tag: 'img',
        attrs: { src: this.src, alt: this.alt },
      });
    }
    return `![${this.alt}](${this.src})`;
  }
}
