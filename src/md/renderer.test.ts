import { heading } from './block/heading';
import { list } from './block/list';
import { paragraph } from './block/paragraph';
import { Block } from './elements';
import { bold } from './inline/bold';
import { footnote } from './inline/footnote';
import { md } from './md';
import { Renderer } from './renderer';

describe('Renderer', () => {
  describe('renderDocument', () => {
    it('should render document with blocks separated by empty lines', () => {
      expect(
        new Renderer().renderDocument([
          heading(1, 'Greeting'),
          paragraph('Hello, world!'),
          list(['Like', 'Subscribe']),
        ])
      ).toBe('# Greeting\n\nHello, world!\n\n- Like\n- Subscribe\n');
    });

    it('should render footnotes at end of document', () => {
      expect(
        new Renderer().renderDocument([
          paragraph(md`Sign the NDA${footnote('Non-Disclosure Agreement')}.`),
          paragraph("Once it's signed, await invite to repo."),
        ])
      ).toBe(
        `Sign the NDA[^1].\n\nOnce it\'s signed, await invite to repo.\n\n[^1]: Non-Disclosure Agreement\n`
      );
    });

    it('should skip empty blocks', () => {
      expect(new Renderer().renderDocument([paragraph(''), list([])])).toBe(
        '\n'
      );
    });
  });

  describe('renderText', () => {
    it('should render string as-is', () => {
      expect(new Renderer().renderText('foo')).toBe('foo');
    });

    it('should render single mark as markdown', () => {
      expect(new Renderer().renderText(bold('foo'))).toBe('**foo**');
    });

    it('should render single block as markdown', () => {
      expect(new Renderer().renderText(list(['foo', 'bar']))).toBe(
        '- foo\n- bar'
      );
    });

    it('should render array with marks as markdown', () => {
      expect(new Renderer().renderText(['Hello, ', bold('John Doe')])).toBe(
        'Hello, **John Doe**'
      );
    });

    it('should render array with marks and blocks as markdown', () => {
      expect(
        new Renderer().renderText(['item 1', list(['item 1.1', 'item 1.2'])])
      ).toBe('item 1\n- item 1.1\n- item 1.2');
    });
  });

  describe('renderTextAsHtml', () => {
    it('should render string as-is', () => {
      expect(new Renderer().renderTextAsHtml('foo')).toBe('foo');
    });

    it('should render mark as html', () => {
      expect(new Renderer().renderTextAsHtml(bold('foo'))).toBe('<b>foo</b>');
    });

    it('should render block as html', () => {
      expect(new Renderer().renderTextAsHtml(list(['foo', 'bar']))).toBe(
        '<ul><li>foo</li><li>bar</li></ul>'
      );
    });

    it('should render array with marks and blocks as html', () => {
      expect(
        new Renderer().renderTextAsHtml([
          'item 1',
          list(['item 1.1', 'item 1.2']),
        ])
      ).toBe('item 1<ul><li>item 1.1</li><li>item 1.2</li></ul>');
    });
  });

  describe('renderInline', () => {
    it('should render mark as markdown in inline mode', () => {
      expect(new Renderer().renderInline(bold('foo'))).toBe('**foo**');
    });

    it('should render block as html in inline mode', () => {
      expect(new Renderer().renderInline(list(['foo', 'bar']))).toBe(
        '<ul><li>foo</li><li>bar</li></ul>'
      );
    });
  });

  describe('renderHtmlElement', () => {
    it('should render empty element', () => {
      expect(new Renderer().renderHtmlElement({ tag: 'hr' })).toBe('<hr />');
    });

    it('should render empty element with attributes', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'img',
          attrs: { src: '/assets/logo.png', alt: 'Logo' },
        })
      ).toBe('<img src="/assets/logo.png" alt="Logo" />');
    });

    it('should render element with string content', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'p',
          content: 'Lorem ipsum ...',
        })
      ).toBe('<p>Lorem ipsum ...</p>');
    });

    it('should render element with child element', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'body',
          content: { tag: 'div', attrs: { id: 'root' } },
        })
      ).toBe('<body><div id="root" /></body>');
    });

    it('should render element with multiple child elements', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'ol',
          content: [
            { tag: 'li', content: 'Veni' },
            { tag: 'li', content: 'Vidi' },
            { tag: 'li', content: 'Vici' },
          ],
        })
      ).toBe('<ol><li>Veni</li><li>Vidi</li><li>Vici</li></ol>');
    });

    it('should render boolean attribute', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'input',
          attrs: { type: 'checkbox', checked: true },
        })
      ).toBe('<input type="checkbox" checked />');
    });

    it('should omit boolean attribute if false', () => {
      expect(
        new Renderer().renderHtmlElement({
          tag: 'input',
          attrs: { type: 'checkbox', checked: false },
        })
      ).toBe('<input type="checkbox" />');
    });
  });

  describe('counters', () => {
    it('should initialize new counter to 1', () => {
      expect(new Renderer().incrementCounter('footnotes')).toBe(1);
    });

    it('should increment existing counter by 1 each time', () => {
      const renderer = new Renderer();
      renderer.incrementCounter('footnotes');
      renderer.incrementCounter('footnotes');
      const finalCount = renderer.incrementCounter('footnotes');
      expect(finalCount).toBe(3);
    });
  });

  describe('extra blocks', () => {
    it('should append block', () => {
      const renderer = new Renderer();
      const block = {} as Block;
      renderer.appendBlock(block);
      expect(renderer.extraBlocks).toEqual([block]);
    });

    it('should have no extra blocks initially', () => {
      expect(new Renderer().extraBlocks).toHaveLength(0);
    });
  });
});
