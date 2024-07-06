import { Mark } from '../elements';
import type { Renderer } from '../renderer';

/**
 * Creates **image** element.
 *
 * @example
 * image('./images/logo.png', 'Logo')
 *
 * @param src image URL
 * @param alt alternative text when image cannot be displayed
 * @returns image mark
 */
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
