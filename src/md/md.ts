import type { FormattedText, FormattedTextItem } from './text';

export function md(
  strings: TemplateStringsArray,
  ...items: FormattedTextItem[]
): FormattedText {
  return strings.flatMap((text, i) => {
    const item = items[i];
    if (item) {
      return [{ text }, item];
    }
    return { text };
  });
}
