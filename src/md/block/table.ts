import type { IBlock } from '../block';
import type { Renderer } from '../renderer';
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
    rows.map(cells => new TableRowBlock(cells.slice(0, columns.length)))
  );
}

export class TableBlock implements IBlock {
  constructor(
    public readonly columns: TableColumnBlock[],
    public readonly rows: TableRowBlock[]
  ) {}

  render(renderer: Renderer): string {
    return [
      new TableRowBlock(this.columns.map(({ heading }) => heading)),
      new TableRowBlock(
        this.columns.map(({ alignment }) => {
          switch (alignment) {
            case 'left':
              return ':--';
            case 'center':
              return ':-:';
            case 'right':
              return '--:';
            default:
              return '---';
          }
        })
      ),
      ...this.rows,
    ]
      .map(row => row.render(renderer))
      .join('\n');
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'table',
      content: [
        renderer.renderHtmlElement({
          tag: 'tr',
          content: this.columns.map(col => col.renderAsHtml(renderer)).join(''),
        }),
        ...this.rows.map(row => row.renderAsHtml(renderer)),
      ].join(''),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}

export class TableColumnBlock implements IBlock {
  constructor(
    public readonly heading: BlockText,
    public readonly alignment?: TableCellAlignment
  ) {}

  render(renderer: Renderer): string {
    return renderer.renderText(this.heading);
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'th',
      attrs: this.alignment && { style: `text-align: ${this.alignment}` },
      content: renderer.renderTextAsHtml(this.heading),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}

export class TableRowBlock implements IBlock {
  constructor(public readonly cells: BlockText[]) {}

  render(renderer: Renderer): string {
    return `| ${this.cells
      .map(cell => renderer.renderText(cell))
      .join(' | ')} |`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'tr',
      content: this.cells
        .map(cell =>
          renderer.renderHtmlElement({
            tag: 'td',
            content: renderer.renderTextAsHtml(cell),
          })
        )
        .join(''),
    });
  }

  renderInline(renderer: Renderer): string {
    return this.renderAsHtml(renderer);
  }
}
