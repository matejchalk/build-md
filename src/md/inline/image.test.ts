import { Renderer } from '../renderer';
import { image } from './image';

describe('image', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(image('/assets/logo.png', 'Logo').render(renderer)).toBe(
      '![Logo](/assets/logo.png)'
    );
  });

  it('should render as html', () => {
    expect(image('/assets/logo.png', 'Logo').renderAsHtml(renderer)).toBe(
      '<img src="/assets/logo.png" alt="Logo" />'
    );
  });
});
