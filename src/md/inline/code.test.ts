import { Renderer } from '../renderer';
import { code } from './code';

describe('code', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(code('console.log').render(renderer)).toBe('`console.log`');
  });

  it('should render as html', () => {
    expect(code('console.log').renderAsHtml(renderer)).toBe(
      '<code>console.log</code>'
    );
  });
});
