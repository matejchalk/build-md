import type { Block, Mark } from './elements';

export function md<TMark extends Mark = never, TBlock extends Block = never>(
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
