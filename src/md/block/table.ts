import type { IBlock } from '../block';
import type { BlockText } from '../text';

export type TableCellAlignment = 'left' | 'center' | 'right';

export function table(
  columns: (
    | BlockText
    | { heading: BlockText; alignment?: TableCellAlignment }
  )[],
  rows: BlockText[][]
): TableBlock {
  return new TableBlock(
    columns.map(col =>
      typeof col === 'object' && 'heading' in col
        ? new TableColumnBlock(col.heading, col.alignment)
        : new TableColumnBlock(col)
    ),
    rows.map(cells => new TableRowBlock(cells))
  );
}

export class TableBlock implements IBlock {
  constructor(
    public readonly columns: TableColumnBlock[],
    public readonly rows: TableRowBlock[]
  ) {}
}

export class TableColumnBlock implements IBlock {
  constructor(
    public readonly heading: BlockText,
    public readonly alignment?: TableCellAlignment
  ) {}
}

export class TableRowBlock implements IBlock {
  constructor(public readonly cells: BlockText[]) {}
}
