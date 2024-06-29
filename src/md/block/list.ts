import type { IBlock } from '../block';
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
        items.map(item => new OrderedListItemBlock(extractText(item)))
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

export class UnorderedListBlock implements IBlock {
  constructor(public readonly items: UnorderedListItemBlock[]) {}
}

export class UnorderedListItemBlock implements IBlock {
  constructor(public readonly text: BlockText) {}
}

export class OrderedListBlock implements IBlock {
  constructor(public readonly items: OrderedListItemBlock[]) {}
}

export class OrderedListItemBlock implements IBlock {
  constructor(public readonly text: BlockText) {}
}

export class TaskListBlock implements IBlock {
  constructor(public readonly items: TaskListItemBlock[]) {}
}

export class TaskListItemBlock implements IBlock {
  constructor(
    public readonly text: BlockText,
    public readonly checked: boolean
  ) {}
}
