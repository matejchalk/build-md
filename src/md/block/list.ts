import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

export type ListKind = 'unordered' | 'ordered' | 'task';

type ListItemInput = BlockText | TaskListItemInput;
type TaskListItemInput = [boolean, BlockText];

export function list(items: BlockText[]): UnorderedListBlock;

export function list(kind: 'unordered', items: BlockText[]): UnorderedListBlock;

export function list(kind: 'ordered', items: BlockText[]): OrderedListBlock;

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

export class UnorderedListBlock extends ListBlock<UnorderedListItemBlock> {
  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'ul',
      content: this.items.map(item => item.renderAsHtml(renderer)).join(''),
    });
  }
}

export class UnorderedListItemBlock extends Block {
  constructor(public readonly text: BlockText) {
    super();
  }

  render(renderer: Renderer): string {
    return `- ${renderer.renderText(this.text, {
      attachableBlocks: ATTACHABLE_BLOCKS,
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

export class OrderedListItemBlock extends Block {
  constructor(public readonly text: BlockText, public readonly order: number) {
    super();
  }

  render(renderer: Renderer): string {
    return `${this.order}. ${renderer.renderText(this.text, {
      attachableBlocks: ATTACHABLE_BLOCKS,
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

export class TaskListItemBlock extends Block {
  constructor(
    public readonly text: BlockText,
    public readonly checked: boolean
  ) {
    super();
  }

  render(renderer: Renderer): string {
    return `- [${this.checked ? 'x' : ' '}] ${renderer.renderText(this.text, {
      attachableBlocks: ATTACHABLE_BLOCKS,
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

const ATTACHABLE_BLOCKS = [UnorderedListBlock, OrderedListBlock, TaskListBlock];
