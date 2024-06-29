import type { IMark } from '../mark';
import type { Renderer } from '../renderer';

export function image(src: string, alt: string): ImageMark {
  return new ImageMark(src, alt);
}

export class ImageMark implements IMark {
  constructor(public readonly src: string, public readonly alt: string) {}

  render(_: Renderer): string {
    return `![${this.alt}](${this.src})`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'img',
      attrs: { src: this.src, alt: this.alt },
    });
  }
}
