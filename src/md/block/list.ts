import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer, RenderMarkdownOptions } from '../renderer';
import type { BlockText } from '../text';

/** Type of list */
export type ListKind = 'unordered' | 'ordered' | 'task';

type ListItemInput = BlockText | TaskListItemInput;
type TaskListItemInput = [boolean, BlockText];

/**
 * Creates **unordered list**.
 *
 * @example
 * list(['first item', 'second item'])
 * @example
 * list([
 *   md`first item with ${italic('text formatting')}`,
 *   md`second item with nested list:${list([
 *    "second item's first item",
 *    "second item's second item"
 *   ])}`
 * ])
 *
 * @param items array of items, each of which may contain block or inline formatting
 * @returns unordered list block
 * @see {@link MarkdownDocument.list}
 */
export function list(items: BlockText[]): UnorderedListBlock;

/**
 * Creates **unordered list**.
 *
 * @example
 * list('unordered' ['first item', 'second item'])
 * @example
 * list('unordered', [
 *   md`first item with ${italic('text formatting')}`,
 *   md`second item with nested list:${list('unordered', [
 *    "second item's first item",
 *    "second item's second item"
 *   ])}`
 * ])
 *
 * @param kind type of list (may be ommitted since `'unordered'` is the default)
 * @param items array of items, each of which may contain block or inline formatting
 * @returns unordered list block
 * @see {@link MarkdownDocument.list}
 */
export function list(kind: 'unordered', items: BlockText[]): UnorderedListBlock;

/**
 * Creates **ordered list**.
 *
 * @example
 * list('ordered' ['first item', 'second item'])
 * @example
 * list('ordered', [
 *   md`first item with ${italic('text formatting')}`,
 *   md`second item with nested list:${list('ordered', [
 *    "second item's first item",
 *    "second item's second item"
 *   ])}`
 * ])
 *
 * @param kind type of list
 * @param items array of items (without numbers), each of which may contain block or inline formatting
 * @returns ordered list block
 * @see {@link MarkdownDocument.list}
 */
export function list(kind: 'ordered', items: BlockText[]): OrderedListBlock;

/**
 * Creates **task list** (also known as _checklist_ or _todo_ list).
 *
 * Part of extended Markdown syntax, not supported by all Markdown processors.
 *
 * @example
 * list('task', [[true, 'first task is done'], [false, 'second task is done']])
 *
 * @param kind type of list
 * @param items array of items, each of which is a tuple of checked state and text (plain or with formatting)
 * @returns task list block
 * @see {@link MarkdownDocument.list}
 */
export function list(
  kind: 'task',
  items: [boolean, BlockText][]
): TaskListBlock;

export function list(
  kindOrItems: ListKind | ListItemInput[],
  optionalItems?: ListItemInput[]
): UnorderedListBlock | OrderedListBlock | TaskListBlock {
  const kind: ListKind =
    typeof kindOrItems === 'string' ? kindOrItems : 'unordered';
  const items: ListItemInput[] = Array.isArray(kindOrItems)
    ? kindOrItems
    : optionalItems ?? [];

  const isTaskItem = (item: ListItemInput): item is TaskListItemInput =>
    Array.isArray(item) && typeof item[0] === 'boolean';
  const extractText = (item: ListItemInput): BlockText =>
    isTaskItem(item) ? item[1] : item;

  switch (kind) {
    case 'unordered':
      return new UnorderedListBlock(
        items.map(item => new UnorderedListItemBlock(extractText(item)))
      );

    case 'ordered':
      return new OrderedListBlock(
        items.map(
          (item, index) =>
            new OrderedListItemBlock(extractText(item), index + 1)
        )
      );

    case 'task':
      return new TaskListBlock(
        items.map(
          item =>
            new TaskListItemBlock(
              extractText(item),
              isTaskItem(item) ? item[0] : false
            )
        )
      );
  }
}

abstract class ListBlock<TItemBlock extends Block> extends Block {
  constructor(public readonly items: TItemBlock[]) {
    super();
  }

  render(renderer: Renderer): string {
    return this.items
      .map((item, index, array) => {
        const isLast = index === array.length - 1;
        const str = item.render(renderer);
        if (str.split('\n')[1] === '' && !isLast) {
          return `${str}\n`;
        }
        return str;
      })
      .join('\n');
  }
}

abstract class ListItemBlock extends Block {
  readonly attachableBlocks: RenderMarkdownOptions['attachableBlocks'] = [
    UnorderedListBlock,
    OrderedListBlock,
    TaskListBlock,
  ];
}

export class UnorderedListBlock extends ListBlock<UnorderedListItemBlock> {
  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'ul',
      content: this.items.map(item => item.renderAsHtml(renderer)).join(''),
    });
  }
}

class UnorderedListItemBlock extends ListItemBlock {
  constructor(public readonly text: BlockText) {
    super();
  }

  render(renderer: Renderer): string {
    return `- ${renderer.renderText(this.text, {
      attachableBlocks: this.attachableBlocks,
      indentation: 2,
    })}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}

export class OrderedListBlock extends ListBlock<OrderedListItemBlock> {
  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'ol',
      content: this.items.map(item => item.renderAsHtml(renderer)).join(''),
    });
  }
}

class OrderedListItemBlock extends ListItemBlock {
  constructor(public readonly text: BlockText, public readonly order: number) {
    super();
  }

  render(renderer: Renderer): string {
    return `${this.order}. ${renderer.renderText(this.text, {
      attachableBlocks: this.attachableBlocks,
      indentation: this.order.toString().length + 2,
    })}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}

export class TaskListBlock extends ListBlock<TaskListItemBlock> {
  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'ul',
      content: this.items.map(item => item.renderAsHtml(renderer)).join(''),
    });
  }
}

class TaskListItemBlock extends ListItemBlock {
  constructor(
    public readonly text: BlockText,
    public readonly checked: boolean
  ) {
    super();
  }

  render(renderer: Renderer): string {
    return `- [${this.checked ? 'x' : ' '}] ${renderer.renderText(this.text, {
      attachableBlocks: this.attachableBlocks,
      indentation: 2,
    })}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: [
        renderer.renderHtmlElement({
          tag: 'input',
          attrs: {
            type: 'checkbox',
            checked: this.checked,
          },
        }),
        renderer.renderTextAsHtml(this.text),
      ].join(' '),
    });
  }
}
