import type { Renderer } from './renderer';

export interface IMark {
  render(renderer: Renderer): string;

  renderAsHtml(renderer: Renderer): string;
}
