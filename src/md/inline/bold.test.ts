import { Renderer } from '../renderer';
import { bold } from './bold';

describe('bold', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(bold('hello').render(renderer)).toBe('**hello**');
  });

  it('should render as html', () => {
    expect(bold('hello').renderAsHtml(renderer)).toBe('<b>hello</b>');
  });
});
