import type { IBlock } from './block';
import type { IMark } from './mark';

export function md<TMark extends IMark = never, TBlock extends IBlock = never>(
  strings: TemplateStringsArray,
  ...items: (TMark | TBlock | (string | TMark | TBlock)[])[]
): (string | TMark | TBlock)[] {
  return strings.flatMap((text, i) => {
    const item = items[i];
    if (item) {
      if (Array.isArray(item)) {
        return [text, ...item];
      }
      return [text, item];
    }
    return text;
  });
}
