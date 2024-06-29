import type { RenderContext } from './context';

export interface IMark {
  render(ctx: RenderContext): string;
}
