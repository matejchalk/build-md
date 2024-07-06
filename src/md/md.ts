import type { IElement } from './elements';
import { Renderer } from './renderer';

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
  const result: (string | IElement)[] = strings
    .flatMap((text, i) => {
      const item = items[i];
      if (item) {
        if (Array.isArray(item)) {
          return [text, ...item];
        }
        return [text, item];
      }
      return text;
    })
    .filter(Boolean);

  result.toString = () => {
    const renderer = new Renderer();
    return result
      .map(item => (typeof item === 'string' ? item : item.render(renderer)))
      .join('');
  };

  return result as (string | ElementOf<TItems>)[];
}
