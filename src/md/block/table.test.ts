import { code } from '../inline/code';
import { italic } from '../inline/italic';
import { link } from '../inline/link';
import { Renderer } from '../renderer';
import { codeBlock } from './code';
import { list } from './list';
import { table } from './table';

describe('table', () => {
  const renderer = new Renderer();

  it('should render simple table in markdown', () => {
    expect(
      table(
        ['x', 'y'],
        [
          ['0', '0'],
          ['2', '5'],
        ]
      ).render(renderer)
    ).toBe(
      `
| x   | y   |
| --- | --- |
| 0   | 0   |
| 2   | 5   |
`.trim()
    );
  });

  it('should render simple table in html', () => {
    expect(
      table(
        ['x', 'y'],
        [
          ['0', '0'],
          ['2', '5'],
        ]
      ).renderAsHtml(renderer)
    ).toBe(
      '<table><tr><th>x</th><th>y</th></tr><tr><td>0</td><td>0</td></tr><tr><td>2</td><td>5</td></tr></table>'
    );
  });

  it('should render table with custom alignments in markdown', () => {
    expect(
      table(
        [
          { heading: 'Error', alignment: 'left' },
          { heading: 'Environment', alignment: 'center' },
          { heading: 'Occurrences', alignment: 'right' },
        ],
        [
          [
            "TypeError: Cannot read properties of undefined (reading 'push')",
            'production',
            '19',
          ],
          [
            "TypeError: Cannot read properties of null (reading '0')",
            'staging',
            '5',
          ],
        ]
      ).render(renderer)
    ).toBe(
      `
| Error                                                           | Environment | Occurrences |
| :-------------------------------------------------------------- | :---------: | ----------: |
| TypeError: Cannot read properties of undefined (reading 'push') | production  |          19 |
| TypeError: Cannot read properties of null (reading '0')         |   staging   |           5 |
`.trim()
    );
  });

  it('should render table with custom alignments in html', () => {
    expect(
      table(
        [
          { heading: 'Error', alignment: 'left' },
          { heading: 'Environment', alignment: 'center' },
          { heading: 'Occurrences', alignment: 'right' },
        ],
        [['unknown error', 'production', '3']]
      ).renderAsHtml(renderer)
    ).toBe(
      `<table>
        <tr>
          <th style="text-align: left">Error</th>
          <th style="text-align: center">Environment</th>
          <th style="text-align: right">Occurrences</th>
        </tr>
        <tr>
          <td>unknown error</td>
          <td>production</td>
          <td>3</td>
        </tr>
      </table>`.replace(/>\s+</gm, '><')
    );
  });

  it('should render inline cell formatting as markdown in markdown table', () => {
    expect(
      table(
        [
          'URL',
          [
            link('https://developer.chrome.com/docs/lighthouse', 'Lighthouse'),
            ' score',
          ],
        ],
        [
          [italic('/'), '67'],
          [italic('/about'), '82'],
        ]
      ).render(renderer)
    ).toBe(
      `
| URL      | [Lighthouse](https://developer.chrome.com/docs/lighthouse) score |
| -------- | ---------------------------------------------------------------- |
| _/_      | 67                                                               |
| _/about_ | 82                                                               |
`.trim()
    );
  });

  it('should render block cell formatting as html in markdown table', () => {
    expect(
      table(
        ['Easy setup', 'CI automation'],
        [
          [
            [
              'Our setup wizard will get you up and running in seconds:',
              codeBlock('npx docgen init'),
            ],
            [
              'Refer to our docs for:',
              list([
                link('#github-actions', 'GitHub Actions'),
                link('#circle-ci', 'Circle CI'),
              ]),
            ],
          ],
        ]
      ).render(renderer)
    ).toBe(
      `
| Easy setup                                                                                      | CI automation                                                                                                                   |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Our setup wizard will get you up and running in seconds:<pre><code>npx docgen init</code></pre> | Refer to our docs for:<ul><li><a href="#github-actions">GitHub Actions</a></li><li><a href="#circle-ci">Circle CI</a></li></ul> |
`.trim()
    );
  });

  it('should render cell formatting as html in html table', () => {
    expect(
      table(
        [
          'URL',
          [
            link('https://developer.chrome.com/docs/lighthouse', 'Lighthouse'),
            ' score',
          ],
        ],
        [[italic('/'), list(['Performance: 70', 'Best practices: 90'])]]
      ).renderAsHtml(renderer)
    ).toBe(
      `<table>
        <tr>
          <th>URL</th>
          <th><a href="https://developer.chrome.com/docs/lighthouse">Lighthouse</a> score</th>
        </tr>
        <tr>
          <td><i>/</i></td>
          <td><ul><li>Performance: 70</li><li>Best practices: 90</li></ul></td>
        </tr>
      </table>`.replace(/>\s+</gm, '><')
    );
  });

  it('should render empty cells if row missing array items', () => {
    expect(
      table(
        ['Col. 1', 'Col. 2', 'Col. 3'],
        [
          ['Value 1a', 'Value 2a', 'Value 3a'],
          ['Value 1b', 'Value 2b'],
          ['Value 1c'],
          [],
        ]
      ).render(renderer)
    ).toBe(
      `
| Col. 1   | Col. 2   | Col. 3   |
| -------- | -------- | -------- |
| Value 1a | Value 2a | Value 3a |
| Value 1b | Value 2b |          |
| Value 1c |          |          |
|          |          |          |
`.trim()
    );
  });

  it('should render rows without additional cells outside columns range', () => {
    expect(
      table(
        ['Col. 1', 'Col. 2'],
        [
          ['Value 1a', 'Value 2a', 'Value 3a'],
          ['Value 1b', 'Value 2b', 'Value 3b', 'Value 4b'],
        ]
      ).render(renderer)
    ).toBe(
      `
| Col. 1   | Col. 2   |
| -------- | -------- |
| Value 1a | Value 2a |
| Value 1b | Value 2b |
`.trim()
    );
  });

  it('should convert newlines to br tags in table cells', () => {
    expect(
      table(
        ['Style', 'Description'],
        [
          [
            'CSS Modules',
            'Styles written in CSS files, generates unique class names.\n(Preprocessors like SCSS also supported.)',
          ],
          [
            'Styled Components',
            [
              'CSS-in-JS syntax for creating React components. Example:',
              codeBlock(
                'const Section = styled.section`\n  background: lightgrey;\n  padding: 4em;\n`'
              ),
            ],
          ],
        ]
      ).render(renderer)
    ).toBe(
      `
| Style             | Description                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS Modules       | Styles written in CSS files, generates unique class names.<br />(Preprocessors like SCSS also supported.)                                                                 |
| Styled Components | CSS-in-JS syntax for creating React components. Example:<pre><code>const Section = styled.section\`<br />  background: lightgrey;<br />  padding: 4em;<br />\`</code></pre> |
`.trim()
    );
  });

  it('should escape vertical bars in table cells', () => {
    expect(
      table(
        ['Property', 'Type'],
        [[code('format'), code("'esm' | 'cjs'")]]
      ).render(renderer)
    ).toBe(
      `
| Property | Type             |
| -------- | ---------------- |
| \`format\` | \`'esm' \\| 'cjs'\` |
`.trim()
    );
  });
});
