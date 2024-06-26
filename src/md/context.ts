export type RenderContext = {
  isHtmlOnly: boolean;
  isSingleLine: boolean;
};

export const DEFAULT_RENDER_CONTEXT: RenderContext = {
  isHtmlOnly: false,
  isSingleLine: false,
};
