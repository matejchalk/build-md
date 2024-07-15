import { list } from './block/list';
import { bold } from './inline/bold';
import { code } from './inline/code';
import { italic } from './inline/italic';
import { md } from './md';

describe('md', () => {
  it('should parse string without formatting', () => {
    expect(
      // prettier-ignore
      md`Hello, world!`
    ).toEqual(expect.objectContaining(['Hello, world!']));
  });

  it('should parse string with marks', () => {
    expect(md`${bold('Hello')}, ${italic('world')}!`).toEqual(
      expect.objectContaining([bold('Hello'), ', ', italic('world'), '!'])
    );
  });

  it('should parse string with blocks', () => {
    expect(md`item 1${list(['item 1.1', 'item 1.2'])}`).toEqual(
      expect.objectContaining(['item 1', list(['item 1.1', 'item 1.2'])])
    );
  });

  it('should ignore falsy expressions', () => {
    expect(md`${''}${null}${undefined}${0}${false}`).toHaveLength(0);
  });

  it('should parse nested calls', () => {
    expect(
      md`${bold('LCP')}: ${md`${code('1.2 s')} (score ${italic('83')})`}`
    ).toEqual(
      expect.objectContaining([
        bold('LCP'),
        ': ',
        code('1.2 s'),
        ' (score ',
        italic('83'),
        ')',
      ])
    );
  });

  it('should stringify result using markdown renderer', () => {
    const result = md`${bold('Hello')}, ${italic('world')}!`;
    const markdown = '**Hello**, _world_!';

    expect(result.toString()).toBe(markdown);
    expect(`${result}`).toBe(markdown);
    expect(result + '').toBe(markdown);
    expect([result].join()).toBe(markdown);
  });
});
