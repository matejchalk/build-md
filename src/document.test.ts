import { MarkdownDocument } from './document';
import { md } from './md';

describe('MarkdownDocument', () => {
  it('should render basic block elements', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'Contributing')
        .paragraph(
          "This document describes what you'll need to get up and running in this codebase."
        )
        .heading(2, 'Prerequisites')
        .paragraph("Make sure you've installed the following:")
        .list(['Node.js (v20+)', 'Yarn (v1)'])
        .paragraph(
          'Run yarn command in root directory to install dependencies.'
        )
        .heading(2, 'Local development')
        .paragraph('Yarn scripts are available for common tasks:')
        .code(
          'sh',
          [
            'yarn test # executes unit tests',
            'yarn e2e # runs E2E tests',
            'yarn build # compiles source code for distribution',
            'yarn lint # checks for codestyle problems',
          ].join('\n')
        )
        .heading(3, 'Working on a new feature')
        .list('ordered', [
          'Fork the repository.',
          'Create a new feature branch.',
          'Commit and push your changes to the feature branch.',
          'When ready, open a pull request to the main branch.',
        ])
        .quote(
          'TIP: If you\'re working on an open issue, referencing the issue number with "closes #123" in the PR description will automatically link it.'
        )
        .rule()
        .heading(2, 'Troubleshooting')
        .paragraph('If you run into problems, try searching in Issues tab.')
        .toString()
    ).toMatchFileSnapshot('__snapshots__/basic-blocks.md');
  });

  it('should render basic inline elements', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'zod2md')
        .paragraph(
          md`${md.link(
            'https://www.npmjs.com/package/zod2md',
            md.image('https://img.shields.io/npm/v/zod2md', 'Package version')
          )} ${md.link(
            'https://opensource.org/license/mit/',
            md.image('https://img.shields.io/npm/l/zod2md', 'License')
          )}`
        )
        .paragraph(
          md.italic(
            md`Generates ${md.bold('Markdown')} documentation from ${md.link(
              'https://zod.dev/',
              'Zod'
            )} schemas.`
          )
        )
        .heading(2, 'Setup')
        .paragraph(md`Install with ${md.code('npm install -D zod2md')}.`)
        .toString()
    ).toMatchFileSnapshot('__snapshots__/basic-inline.md');
  });

  it('should render block and inline elements from extended syntax', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'CLI')
        .table(
          ['Option', 'Description'],
          [
            [md`${md.code('-i')}, ${md.code('--input')}`, 'Input file path'],
            [
              md`${md.code('-o')}, ${md.code('--output')} ${md.footnote(
                'Output format determined by file extension.'
              )}`,
              'Output file path',
            ],
            [md.code('--version'), 'Print version and exit'],
          ]
        )
        .details(
          'Examples',
          md.list([
            md`${md.code(
              'gendocs --input src/index.ts'
            )} - reads input from file and prints to stdout`,
            md`${md.code(
              'gendocs -i src/index.ts -o docs/API.md'
            )} - reads input and output from file`,
            md`${md.code('gendocs --version')} - prints installed version`,
          ])
        )
        .heading(2, 'Roadmap')
        .list('task', [
          [true, 'Markdown output'],
          [true, 'HTML output'],
          [false, md`${md.strikethrough('PDF output')} (not planned)`],
          [false, 'Custom HTML themes'],
        ])
        .toString()
    ).toMatchFileSnapshot('__snapshots__/extended-syntax.md');
  });

  it('should not render blocks with falsy content', () => {
    expect(
      new MarkdownDocument()
        .heading(1, '')
        .paragraph(undefined)
        .list([])
        .code(null)
        .table([], [])
        .toString()
    ).toBe('\n');
  });

  it('should be immutable by default', () => {
    const doc1 = new MarkdownDocument().heading(1, 'Greetings');
    const doc2 = doc1.paragraph('Hello, world!');
    expect(doc1.toString()).not.toBe(doc2.toString());
  });

  it('should be mutable if specified', () => {
    const doc1 = new MarkdownDocument({
      mutable: true,
    }).heading(1, 'Greetings');
    const doc2 = doc1.paragraph('Hello, world!');
    expect(doc1.toString()).toBe(doc2.toString());
  });

  it('should render blocks when $if condition is true', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'My title')
        .$if(true, doc =>
          doc.heading(2, 'Greetings').paragraph('Hello, world!')
        )
        .toString()
    ).toBe('# My title\n\n## Greetings\n\nHello, world!\n');
  });

  it('should not render blocks when $if condition is false', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'My title')
        .$if(false, doc =>
          doc.heading(2, 'Greetings').paragraph('Hello, world!')
        )
        .toString()
    ).toBe('# My title\n');
  });

  it('should render "else" blocks when $if condition is false', () => {
    expect(
      new MarkdownDocument()
        .heading(1, 'My title')
        .$if(
          false,
          doc => doc.heading(2, 'Greetings').paragraph('Hello, world!'),
          doc => doc.paragraph('Not in the mood to greet anyone.')
        )
        .toString()
    ).toBe('# My title\n\nNot in the mood to greet anyone.\n');
  });

  it('should render blocks for each item with $foreach', () => {
    expect(
      new MarkdownDocument()
        .$foreach(
          [
            { title: 'Chapter 1', content: 'Content of 1st chapter.' },
            { title: 'Chapter 2', content: 'Content of 2nd chapter.' },
            { title: 'Chapter 3', content: 'Content of 3rd chapter.' },
          ],
          (doc, { title, content }) => doc.heading(2, title).paragraph(content)
        )
        .toString()
    ).toBe(
      '## Chapter 1\n\nContent of 1st chapter.\n\n## Chapter 2\n\nContent of 2nd chapter.\n\n## Chapter 3\n\nContent of 3rd chapter.\n'
    );
  });
});
