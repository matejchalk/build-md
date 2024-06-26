export type RenderContext = {
  isHtmlOnly: boolean;
  isSingleLine: boolean;
  generateFootnoteLabel(): string;
  registerFootnote(label: string, text: string): void;
};
