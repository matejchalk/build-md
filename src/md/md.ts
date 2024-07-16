import type { Conditional } from './conditional';
import type { Element } from './elements';
import { Renderer } from './renderer';
import type { FormattedText } from './text';

type Items<TElement extends Element = Element> = Conditional<
  string | TElement | (string | TElement)[]
>[];
type ElementOf<TItems extends Items> = TItems extends Items<infer U>
  ? U
  : never;

/**
 * Creates formatted markdown text, called using tagged template literal syntax.
 *
 * @example
 * md`text with ${bold('formatting')}`
 * @example
 * md`${bold('nested')} expressions ${md`also ${italic('work')}`}`
 *
 * @param strings plain strings
 * @param items formatting elements
 * @returns strings and elements in order
 */
export function md<TItems extends Items>(
  strings: TemplateStringsArray,
  ...items: TItems
): FormattedText<ElementOf<TItems>> {
  const result = strings
    .flatMap((text, i) => {
      const item = items[i] as Items<ElementOf<TItems>>[number];
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

  return result;
}
