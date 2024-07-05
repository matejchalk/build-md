import { code } from '../inline/code';
import { Renderer } from '../renderer';
import { heading } from './heading';

describe('heading', () => {
  const renderer = new Renderer();

  it('should render top-level heading in markdown', () => {
    expect(heading(1, 'build-md').render(renderer)).toBe('# build-md');
  });

  it('should render other heading levels in markdown', () => {
    expect(heading(2, 'Setup').render(renderer)).toBe('## Setup');
    expect(heading(3, 'Installation').render(renderer)).toBe(
      '### Installation'
    );
  });

  it('should render top-level heading in html', () => {
    expect(heading(1, 'build-md').renderAsHtml(renderer)).toBe(
      '<h1>build-md</h1>'
    );
  });

  it('should render other heading levels in html', () => {
    expect(heading(2, 'Setup').renderAsHtml(renderer)).toBe('<h2>Setup</h2>');
    expect(heading(3, 'Installation').renderAsHtml(renderer)).toBe(
      '<h3>Installation</h3>'
    );
  });

  it('should render inline formatting in markdown', () => {
    expect(heading(4, [code('Enum.extend'), ' method']).render(renderer)).toBe(
      '#### `Enum.extend` method'
    );
  });

  it('should render inline formatting in html', () => {
    expect(
      heading(4, [code('Enum.extend'), ' method']).renderAsHtml(renderer)
    ).toBe('<h4><code>Enum.extend</code> method</h4>');
  });
});
