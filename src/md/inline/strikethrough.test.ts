import { Renderer } from '../renderer';
import { strikethrough } from './strikethrough';

describe('strikethrough', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(strikethrough('hello').render(renderer)).toBe('~~hello~~');
  });

  it('should render as html', () => {
    expect(strikethrough('hello').renderAsHtml(renderer)).toBe('<s>hello</s>');
  });
});
