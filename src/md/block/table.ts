import type { MarkdownDocument } from '../../document';
import { Block } from '../elements';
import type { Renderer } from '../renderer';
import type { BlockText } from '../text';

export type TableCellAlignment = 'left' | 'center' | 'right';

/**
 * Creates **table**.
 *
 * Part of extended Markdown syntax, not supported by all Markdown processors.
 *
 * @example
 * table(['x', 'y'], [['0', '0'], ['5', '20']])
 * @example
 * table(
 *   [
 *     { heading: 'Error', alignment: 'left' },
 *     { heading: link('./environments.md', 'Environment'), alignment: 'center' },
 *     { heading: 'Occurrences', alignment: 'right' },
 *   ],
 *   [
 *     [
 *       code("TypeError: Cannot read properties of undefined (reading 'push')"),
 *       'production',
 *       '19',
 *     ],
 *     [
 *       code("TypeError: Cannot read properties of null (reading '0')"),
 *       'staging',
 *       '5',
 *     ],
 *   ]
 * )
 *
 * @param columns table header - column heading texts with optional column alignments
 * @param rows table body - rows with text content for column cells
 * @returns table block
 * @see {@link MarkdownDocument.table}
 */
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
    const rowsWithoutPadding = [
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
    ].map(row => row.render(renderer));

    const rowCells = rowsWithoutPadding.map(row =>
      row
        .slice(2, -2)
        .split(' | ')
        .map(cell => cell.trim())
    );
    const columnsCount = rowCells[0]!.length;
    const columnWidths = Array.from({ length: columnsCount }).map(
      (_, colIndex) =>
        Math.max(...rowCells.map(row => row[colIndex]?.length ?? 0))
    );

    const rowsWithPadding = rowCells.map((row, rowIndex) => {
      const cells = row.map((cell, colIndex) => {
        const width = Math.max(cell.length, columnWidths[colIndex] ?? 0);

        if (rowIndex === 1) {
          const fillCount = width - cell.length;
          return `${cell[0]}${'-'.repeat(fillCount)}${cell.slice(1)}`;
        }

        const alignment: TableCellAlignment =
          (typeof this.columns[colIndex] === 'object' &&
            this.columns[colIndex].alignment) ||
          'left';
        switch (alignment) {
          case 'left':
            return cell.padEnd(width, ' ');
          case 'center':
            const fillCount = width - cell.length;
            const prefix = ' '.repeat(Math.floor(fillCount / 2));
            const suffix = ' '.repeat(Math.ceil(fillCount / 2));
            return `${prefix}${cell}${suffix}`;
          case 'right':
            return cell.padStart(width, ' ');
        }
      });
      return `| ${cells.join(' | ')} |`;
    });

    return rowsWithPadding.join('\n');
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
