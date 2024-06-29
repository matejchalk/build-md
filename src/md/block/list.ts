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
            new OrderedListItemBlock(extractText(item), index + 1, items.length)
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

export class UnorderedListBlock extends Block {
  constructor(public readonly items: UnorderedListItemBlock[]) {
    super();
  }

  render(renderer: Renderer): string {
    return this.items.map(item => item.render(renderer)).join('\n');
  }

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
    return `- ${renderer.renderText(this.text)}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}

export class OrderedListBlock extends Block {
  constructor(public readonly items: OrderedListItemBlock[]) {
    super();
  }

  render(renderer: Renderer): string {
    return this.items.map(item => item.render(renderer)).join('\n');
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'ol',
      content: this.items.map(item => item.renderAsHtml(renderer)).join(''),
    });
  }
}

export class OrderedListItemBlock extends Block {
  constructor(
    public readonly text: BlockText,
    public readonly order: number,
    public readonly count: number
  ) {
    super();
  }

  render(renderer: Renderer): string {
    const maxDigits = Math.floor(Math.log10(this.count || 1)) + 1;
    const prefix = this.order.toString().padStart(maxDigits, ' ');
    return `${prefix} ${renderer.renderText(this.text)}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: renderer.renderTextAsHtml(this.text),
    });
  }
}

export class TaskListBlock extends Block {
  constructor(public readonly items: TaskListItemBlock[]) {
    super();
  }

  render(renderer: Renderer): string {
    return this.items.map(item => item.render(renderer)).join('\n');
  }

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
    return `- [${this.checked ? 'x' : ' '}] ${renderer.renderText(this.text)}`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'li',
      content: [
        renderer.renderHtmlElement({
          tag: 'input',
          attrs: { checked: this.checked },
        }),
        renderer.renderTextAsHtml(this.text),
      ].join(' '),
    });
  }
}
