import { Renderer } from '../renderer';
import { bold } from './bold';
import { strikethrough } from './strikethrough';

describe('strikethrough', () => {
  const renderer = new Renderer();

  it('should render as markdown', () => {
    expect(strikethrough('hello').render(renderer)).toBe('~~hello~~');
  });

  it('should render as html', () => {
    expect(strikethrough('hello').renderAsHtml(renderer)).toBe('<s>hello</s>');
  });

  it('should wrap other marks', () => {
    expect(
      strikethrough(['30 day ', bold('free trial')]).render(renderer)
    ).toBe('~~30 day **free trial**~~');
  });
});
