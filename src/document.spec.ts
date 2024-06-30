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
});
