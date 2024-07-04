import { Renderer } from '../renderer';
import { list } from './list';

describe('list', () => {
  const renderer = new Renderer();

  it('should render unordered list by default', () => {
    expect(list(['foo', 'bar']).render(renderer)).toBe('- foo\n- bar');
  });

  it('should render unordered list if specified', () => {
    expect(list('unordered', ['foo', 'bar']).render(renderer)).toBe(
      '- foo\n- bar'
    );
  });

  it('should render ordered list if specified', () => {
    expect(list('ordered', ['foo', 'bar']).render(renderer)).toBe(
      '1. foo\n2. bar'
    );
  });

  it('should render task list if specified', () => {
    expect(
      list('task', [
        [true, 'foo'],
        [false, 'bar'],
      ]).render(renderer)
    ).toBe('- [x] foo\n- [ ] bar');
  });

  it('should render unordered list as html', () => {
    expect(list('unordered', ['foo', 'bar']).renderAsHtml(renderer)).toBe(
      '<ul><li>foo</li><li>bar</li></ul>'
    );
  });

  it('should render ordered list as html', () => {
    expect(list('ordered', ['foo', 'bar']).renderAsHtml(renderer)).toBe(
      '<ol><li>foo</li><li>bar</li></ol>'
    );
  });

  it('should render task list as html', () => {
    expect(
      list('task', [
        [true, 'foo'],
        [false, 'bar'],
      ]).renderAsHtml(renderer)
    ).toBe(
      '<ul><li><input type="checkbox" checked /> foo</li><li><input type="checkbox" /> bar</li></ul>'
    );
  });

  it('should render nested list of same kind', () => {
    expect(
      list([
        ['House Stark', list(['Sansa', 'Arya', 'Bran', 'Rickon'])],
        ['House Lannister', list(['Cersei', 'Jaime', 'Tyrion'])],
      ]).render(renderer)
    ).toBe(
      `
- House Stark
  - Sansa
  - Arya
  - Bran
  - Rickon
- House Lannister
  - Cersei
  - Jaime
  - Tyrion
`.trim()
    );
  });

  it('should render deeply nested lists of different kinds', () => {
    expect(
      list('ordered', [
        [
          'Fry vegetables and sausage',
          list('unordered', [
            [
              'ingredients:',
              list('task', [
                [true, 'butter'],
                [true, 'olive oil'],
                [true, 'sausage'],
                [true, 'courgette'],
                [true, 'artichokes'],
                [false, 'peppers'],
                [true, 'mushrooms'],
              ]),
            ],
            'season with salt, fry on a high heat, then sprinkle with fresh parsley',
          ]),
        ],
        [
          'Cook egg mixture',
          list('unordered', [
            [
              'ingredients:',
              list('task', [
                [true, 'eggs (3)'],
                [true, 'sour cream'],
              ]),
            ],
            'season with basil and whisk before slow fry with butter',
          ]),
        ],
        'Add vegetables etc. to egg and fold into omelette',
        'Serve!',
      ]).render(renderer)
    ).toBe(
      `
1. Fry vegetables and sausage
   - ingredients:
     - [x] butter
     - [x] olive oil
     - [x] sausage
     - [x] courgette
     - [x] artichokes
     - [ ] peppers
     - [x] mushrooms
   - season with salt, fry on a high heat, then sprinkle with fresh parsley
2. Cook egg mixture
   - ingredients:
     - [x] eggs (3)
     - [x] sour cream
   - season with basil and whisk before slow fry with butter
3. Add vegetables etc. to egg and fold into omelette
4. Serve!
`.trim()
    );
  });
});
