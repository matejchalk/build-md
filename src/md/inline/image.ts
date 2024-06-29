import { Mark } from '../elements';
import type { Renderer } from '../renderer';

export function image(src: string, alt: string): ImageMark {
  return new ImageMark(src, alt);
}

export class ImageMark extends Mark {
  constructor(public readonly src: string, public readonly alt: string) {
    super();
  }

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
