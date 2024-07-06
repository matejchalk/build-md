import { Block } from '../elements';
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
    rows.map(
      cells => new TableRowBlock(columns.map((_, index) => cells[index] ?? ''))
    )
  );
}

export class TableBlock extends Block {
  constructor(
    public readonly columns: TableColumnBlock[],
    public readonly rows: TableRowBlock[]
  ) {
    super();
  }

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
}

class TableColumnBlock extends Block {
  constructor(
    public readonly heading: BlockText,
    public readonly alignment?: TableCellAlignment
  ) {
    super();
  }

  // ignored by parent
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
}

class TableRowBlock extends Block {
  constructor(public readonly cells: BlockText[]) {
    super();
  }

  render(renderer: Renderer): string {
    return `| ${this.cells
      .map(cell =>
        renderer
          .renderInline(cell)
          .replace(/\n/g, renderer.renderHtmlElement({ tag: 'br' }))
          .replace(/\|/g, '\\|')
      )
      .join(' | ')} |`;
  }

  renderAsHtml(renderer: Renderer): string {
    return renderer.renderHtmlElement({
      tag: 'tr',
      content: this.cells
        .map(cell =>
          renderer.renderHtmlElement({
            tag: 'td',
            content: renderer
              .renderTextAsHtml(cell)
              .replace(/\n/g, renderer.renderHtmlElement({ tag: 'br' })),
          })
        )
        .join(''),
    });
  }
}
