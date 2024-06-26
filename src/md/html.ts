type HtmlElement = {
  tag: string;
  attrs?: Record<string, string>;
  text?: string;
};

export function renderHtml({ tag, attrs, text }: HtmlElement): string {
  const attributes = Object.entries(attrs ?? {})
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');

  if (!text) {
    return `<${tag}${attributes} />`;
  }

  return `<${tag}${attributes}>${text}</${tag}>`;
}
