import type { Renderer } from './renderer';

export interface IBlock {
  render(renderer: Renderer): string;

  renderAsHtml(renderer: Renderer): string;

  renderInline(renderer: Renderer): string;
}
