import { Renderer } from '../renderer';
import { bold } from './bold';
import { italic } from './italic';

describe('bold', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(bold('hello').render(renderer)).toBe('**hello**');
  });

  it('should render as html', () => {
    expect(bold('hello').renderAsHtml(renderer)).toBe('<b>hello</b>');
  });

  it('should wrap other marks', () => {
    expect(bold(['Hello, ', italic('world'), '!']).render(renderer)).toBe(
      '**Hello, _world_!**'
    );
  });
});
