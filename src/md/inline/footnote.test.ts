import { list } from '../block/list';
import { Renderer } from '../renderer';
import { footnote } from './footnote';
import { link } from './link';

describe('footnote', () => {
  it('should render footnote link', () => {
    expect(footnote('Non-Disclosure Agreement').render(new Renderer())).toBe(
      '[^1]'
    );
  });

  it('should append block to render footnote content', () => {
    const renderer = new Renderer();
    vi.spyOn(renderer, 'appendBlock');
    footnote('Non-Disclosure Agreement').render(renderer);
    expect(renderer.appendBlock).toHaveBeenCalled();
    expect(renderer.extraBlocks[0]!.render(renderer)).toBe(
      '[^1]: Non-Disclosure Agreement'
    );
  });

  it('should render custom label', () => {
    const renderer = new Renderer();
    expect(footnote('Non-Disclosure Agreement', 'nda').render(renderer)).toBe(
      '[^nda]'
    );
    expect(renderer.extraBlocks[0]!.render(renderer)).toBe(
      '[^nda]: Non-Disclosure Agreement'
    );
  });

  it('should use incremented counter as default label', () => {
    const renderer = new Renderer();
    expect(footnote('Non-Disclosure Agreement').render(renderer)).toBe('[^1]');
    expect(footnote('Semantic versioning').render(renderer)).toBe('[^2]');
    expect(renderer.extraBlocks[0]!.render(renderer)).toBe(
      '[^1]: Non-Disclosure Agreement'
    );
    expect(renderer.extraBlocks[1]!.render(renderer)).toBe(
      '[^2]: Semantic versioning'
    );
  });

  it('should render content with inline formatting', () => {
    const renderer = new Renderer();
    footnote([
      'For more info, refer to ',
      link('https://zod.dev', 'Zod docs'),
    ]).render(renderer);
    expect(renderer.extraBlocks[0]!.render(renderer)).toBe(
      '[^1]: For more info, refer to [Zod docs](https://zod.dev)'
    );
  });

  it('should render content with block formatting', () => {
    const renderer = new Renderer();
    footnote([
      'The following output formats are supported:',
      list(['Markdown', 'HTML', 'PDF']),
    ]).render(renderer);
    expect(renderer.extraBlocks[0]!.render(renderer)).toBe(
      `
[^1]: The following output formats are supported:

    - Markdown
    - HTML
    - PDF
`.trim()
    );
  });
});
