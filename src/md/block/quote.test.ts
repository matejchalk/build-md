import { link } from '../inline/link';
import { Renderer } from '../renderer';
import { list } from './list';
import { quote } from './quote';

describe('quote', () => {
  const renderer = new Renderer();

  it('should render simple quote in markdown', () => {
    expect(
      quote('Premature optimization is the root of all evil').render(renderer)
    ).toBe('> Premature optimization is the root of all evil');
  });

  it('should render simple quote in html', () => {
    expect(
      quote('Premature optimization is the root of all evil').renderAsHtml(
        renderer
      )
    ).toBe(
      '<blockquote>Premature optimization is the root of all evil</blockquote>'
    );
  });

  it('should render multiline quote with other blocks in markdown', () => {
    expect(
      quote([
        'Learn more about Markdown syntax from the following resources:',
        list([
          link('https://www.markdownguide.org/', 'Markdown Guide'),
          link('https://commonmark.org/help/', 'CommonMark'),
        ]),
      ]).render(renderer)
    ).toBe(
      `
> Learn more about Markdown syntax from the following resources:
>
> - [Markdown Guide](https://www.markdownguide.org/)
> - [CommonMark](https://commonmark.org/help/)
`.trim()
    );
  });

  it('should render quote within quote in markdown', () => {
    expect(
      quote([
        'A wise man once said:',
        quote("Nine people can't make a baby in a month."),
      ]).render(renderer)
    ).toBe(
      `
> A wise man once said:
>
> > Nine people can't make a baby in a month.
`.trim()
    );
  });

  it('should render quote with formatting in html', () => {
    expect(
      quote([
        'For more information, read the ',
        link('https://www.markdownguide.org/', 'Markdown Guide'),
        '.',
      ]).renderAsHtml(renderer)
    ).toBe(
      '<blockquote>For more information, read the <a href="https://www.markdownguide.org/">Markdown Guide</a>.</blockquote>'
    );
  });
});
