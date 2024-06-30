import { MarkdownDocument, md } from '.';

describe('package exports', () => {
  it('should render markdown document', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'Greeting')
        .paragraph('Hello, world!')
        .toString()
    ).toBe(`# Greeting\n\nHello, world!\n`);
  });

  it('should render inline markdown', () => {
    expect(
      md`Generates ${md.bold('Markdown')} docs from ${md.link(
        'https://zod.dev/',
        'Zod'
      )} schemas`.toString()
    ).toBe('Generates **Markdown** docs from [Zod](https://zod.dev/) schemas');
  });
});
