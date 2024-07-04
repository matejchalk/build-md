import { Renderer } from '../renderer';
import { italic } from './italic';
import { link } from './link';

describe('italic', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(italic('hello').render(renderer)).toBe('_hello_');
  });

  it('should render as html', () => {
    expect(italic('hello').renderAsHtml(renderer)).toBe('<i>hello</i>');
  });

  it('should wrap other marks', () => {
    expect(
      italic(link('https://www.markdownguide.org/', 'Markdown Guide')).render(
        renderer
      )
    ).toBe('_[Markdown Guide](https://www.markdownguide.org/)_');
  });
});
