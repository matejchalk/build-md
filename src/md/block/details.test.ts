import { bold } from '../inline/bold';
import { code } from '../inline/code';
import { Renderer } from '../renderer';
import { codeBlock } from './code';
import { details } from './details';
import { list } from './list';

describe('details', () => {
  const renderer = new Renderer();

  it('should render details without summary on multiple lines in markdown', () => {
    expect(details('Look out for hidden costs!').render(renderer)).toBe(
      `
<details>

Look out for hidden costs!

</details>`.trim()
    );
  });

  it('should render details with summary on multiple lines in markdown', () => {
    expect(
      details('Boring formalities', 'Look out for hidden costs!').render(
        renderer
      )
    ).toBe(
      `
<details>
<summary>Boring formalities</summary>

Look out for hidden costs!

</details>`.trim()
    );
  });

  it('should render details without summary on single line in html', () => {
    expect(details('Look out for hidden costs!').renderAsHtml(renderer)).toBe(
      '<details>Look out for hidden costs!</details>'
    );
  });

  it('should render details with summary on single line in html', () => {
    expect(
      details('Boring formalities', 'Look out for hidden costs!').renderAsHtml(
        renderer
      )
    ).toBe(
      '<details><summary>Boring formalities</summary>Look out for hidden costs!</details>'
    );
  });

  it('should render details using markdown formatting in markdown', () => {
    expect(
      details('Advanced setup', [
        'Define your options in a ',
        code('zod2md.config.ts'),
        ' file, e.g.:',
        codeBlock('ts', `export default {\n  entry: './src/schemas.ts'\n}`),
      ]).render(renderer)
    ).toBe(
      `
<details>
<summary>Advanced setup</summary>

Define your options in a \`zod2md.config.ts\` file, e.g.:

\`\`\`ts
export default {
  entry: './src/schemas.ts'
}
\`\`\`

</details>`.trim()
    );
  });

  it('should render details using html formatting in html', () => {
    expect(
      details('Advanced setup', [
        'Define your options in a ',
        code('zod2md.config.ts'),
        ' file, e.g.:',
        codeBlock('ts', `export default { entry: './src/schemas.ts' }`),
      ]).renderAsHtml(renderer)
    ).toBe(
      '<details><summary>Advanced setup</summary>Define your options in a <code>zod2md.config.ts</code> file, e.g.:<pre lang="ts"><code>export default { entry: \'./src/schemas.ts\' }</code></pre></details>'
    );
  });

  it('should render summary using html formatting in markdown', () => {
    expect(
      details(
        [bold('2'), ' vulnerable packages'],
        list([code('ip'), code('express')])
      ).render(renderer)
    ).toBe(
      `
<details>
<summary><b>2</b> vulnerable packages</summary>

- \`ip\`
- \`express\`

</details>
`.trim()
    );
  });

  it('should render summary using html formatting in html', () => {
    expect(
      details(
        [bold('2'), ' vulnerable packages'],
        list([code('ip'), code('express')])
      ).renderAsHtml(renderer)
    ).toBe(
      '<details><summary><b>2</b> vulnerable packages</summary><ul><li><code>ip</code></li><li><code>express</code></li></ul></details>'
    );
  });
});
