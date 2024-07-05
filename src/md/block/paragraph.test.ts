import { bold } from '../inline/bold';
import { Renderer } from '../renderer';
import { paragraph } from './paragraph';

describe('paragraph', () => {
  const renderer = new Renderer();

  it('should render text "as is" in markdown', () => {
    expect(paragraph('Lorem ipsum.').render(renderer)).toBe('Lorem ipsum.');
  });

  it('should render text in html', () => {
    expect(paragraph('Lorem ipsum.').renderAsHtml(renderer)).toBe(
      '<p>Lorem ipsum.</p>'
    );
  });

  it('should render inner elements in markdown', () => {
    expect(
      paragraph(['Hello, ', bold('John Doe'), '. How are you?']).render(
        renderer
      )
    ).toBe('Hello, **John Doe**. How are you?');
  });

  it('should render inner elements in html', () => {
    expect(
      paragraph(['Hello, ', bold('John Doe'), '. How are you?']).renderAsHtml(
        renderer
      )
    ).toBe('<p>Hello, <b>John Doe</b>. How are you?</p>');
  });
});
