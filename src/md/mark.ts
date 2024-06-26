import type { RenderContext } from './context';

export interface IMark {
  toString(ctx?: RenderContext): string;
}
