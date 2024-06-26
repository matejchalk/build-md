import type { IMark } from '../mark';
import type { FormattedTextItem, TextInput } from '../text';
import { addMark } from '../utils';

export function footnote(
  text: TextInput,
  label?: string | number
): FormattedTextItem<FootnoteMark | IMark> {
  return addMark(text, new FootnoteMark(label));
}

export class FootnoteMark implements IMark {
  constructor(public readonly label?: string | number) {}
}
