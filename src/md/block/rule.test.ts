import { Renderer } from '../renderer';
import { rule } from './rule';

describe('rule', () => {
  const renderer = new Renderer();

  it('should render horizontal rule in markdown', () => {
    expect(rule().render(renderer)).toBe('---');
  });

  it('should render horizontal rule in html', () => {
    expect(rule().renderAsHtml(renderer)).toBe('<hr />');
  });
});
