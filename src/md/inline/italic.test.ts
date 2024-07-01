import { Renderer } from '../renderer';
import { italic } from './italic';

describe('italic', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(italic('hello').render(renderer)).toBe('_hello_');
  });

  it('should render as html', () => {
    expect(italic('hello').renderAsHtml(renderer)).toBe('<i>hello</i>');
  });
});
