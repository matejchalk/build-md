import type { IMark } from '../mark';
import type { FormattedTextItem } from '../text';
import { addMark } from '../utils';

export function image(src: string, alt: string): FormattedTextItem<ImageMark> {
  return addMark('', new ImageMark(src, alt));
}

export class ImageMark implements IMark {
  constructor(public readonly src: string, public readonly alt: string) {}
}
