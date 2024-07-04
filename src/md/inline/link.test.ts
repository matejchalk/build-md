import { Renderer } from '../renderer';
import { image } from './image';
import { link } from './link';

describe('link', () => {
  const renderer = new Renderer();

  it('should render simple URL as markdown', () => {
    expect(link('https://google.com').render(renderer)).toBe(
      '<https://google.com>'
    );
  });

  it('should render link with text as markdown', () => {
    expect(link('https://google.com', 'Google').render(renderer)).toBe(
      '[Google](https://google.com)'
    );
  });

  it('should render link with text as markdown', () => {
    expect(
      link('https://www.markdownguide.org/', 'guide', 'Markdown Guide').render(
        renderer
      )
    ).toBe('[guide](https://www.markdownguide.org/ "Markdown Guide")');
  });

  it('should wrap other marks', () => {
    expect(
      link(
        'https://example.com',
        image('https://example.com/logo.png', 'Example')
      ).render(renderer)
    ).toBe('[![Example](https://example.com/logo.png)](https://example.com)');
  });

  it('should render href and title as html anchor', () => {
    expect(
      link('https://www.markdownguide.org/', 'Markdown Guide').renderAsHtml(
        renderer
      )
    ).toBe('<a href="https://www.markdownguide.org/">Markdown Guide</a>');
  });

  it('should reuse URL if missing text in html anchor', () => {
    expect(link('https://www.markdownguide.org/').renderAsHtml(renderer)).toBe(
      '<a href="https://www.markdownguide.org/">https://www.markdownguide.org/</a>'
    );
  });

  it('should render title attribute in html anchor', () => {
    expect(
      link(
        'https://www.markdownguide.org/',
        'guide',
        'Markdown Guide'
      ).renderAsHtml(renderer)
    ).toBe(
      '<a href="https://www.markdownguide.org/" title="Markdown Guide">guide</a>'
    );
  });
});
