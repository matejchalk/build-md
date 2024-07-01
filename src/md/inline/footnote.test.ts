import { Renderer } from '../renderer';
import { footnote } from './footnote';

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
});
