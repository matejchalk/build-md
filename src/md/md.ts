import type { IElement } from './elements';

type Items<TElement extends IElement = IElement> = (
  | TElement
  | (string | TElement)[]
)[];
type ElementOf<TItems extends Items> = TItems extends Items<infer U>
  ? U
  : never;

export function md<TItems extends Items>(
  strings: TemplateStringsArray,
  ...items: TItems
): (string | ElementOf<TItems>)[] {
  const result: (string | IElement)[] = strings.flatMap((text, i) => {
    const item = items[i];
    if (item) {
      if (Array.isArray(item)) {
        return [text, ...item];
      }
      return [text, item];
    }
    return text;
  });
  return result as (string | ElementOf<TItems>)[];
}
