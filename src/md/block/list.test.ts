import { bold } from '../inline/bold';
import { link } from '../inline/link';
import { Renderer } from '../renderer';
import { codeBlock } from './code';
import { list } from './list';
import { quote } from './quote';

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

  it('should render marks in list items', () => {
    expect(
      list([
        [
          'Learn the syntax from the ',
          link('https://www.markdownguide.org', 'Markdown Guide'),
        ],
        bold('Have fun!'),
      ]).render(renderer)
    ).toBe(
      '- Learn the syntax from the [Markdown Guide](https://www.markdownguide.org)\n- **Have fun!**'
    );
  });

  it('should render blocks in list items', () => {
    expect(
      list('ordered', [
        ['Install with NPM:', codeBlock('sh', 'npm install -D zod2md')],
        [
          'Run the CLI with the path to your Zod schema exports:',
          codeBlock(
            'sh',
            'npx zod2md --entry src/schemas.ts --output docs/API.md'
          ),
          quote('Refer to CLI docs for more information.'),
        ],
      ]).render(renderer)
    ).toBe(
      `
1. Install with NPM:

   \`\`\`sh
   npm install -D zod2md
   \`\`\`

2. Run the CLI with the path to your Zod schema exports:

   \`\`\`sh
   npx zod2md --entry src/schemas.ts --output docs/API.md
   \`\`\`

   > Refer to CLI docs for more information.
`.trim()
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

  it('should indent ordered list items according to number of digits', () => {
    expect(
      list(
        'ordered',
        Array.from({ length: 12 }).map((_, i) =>
          i % 3 === 0
            ? [`item ${i + 1}`, quote(`Item ${i + 1} is great!`)]
            : `item ${i + 1}`
        )
      ).render(renderer)
    ).toBe(
      `
1. item 1

   > Item 1 is great!

2. item 2
3. item 3
4. item 4

   > Item 4 is great!

5. item 5
6. item 6
7. item 7

   > Item 7 is great!

8. item 8
9. item 9
10. item 10

    > Item 10 is great!

11. item 11
12. item 12
`.trim()
    );
  });
});
