# build-md

[![npm](https://img.shields.io/npm/v/build-md.svg)](https://www.npmjs.com/package/build-md)
[![CI](https://github.com/matejchalk/build-md/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/matejchalk/build-md/actions/workflows/ci.yml?query=branch%3Amain)
[![codecov](https://codecov.io/github/matejchalk/build-md/graph/badge.svg?token=L9BONN6LRT)](https://codecov.io/github/matejchalk/build-md)

Comprehensive **Markdown builder** for JavaScript/TypeScript.

![Diagram](./images/diagram.png)

📖 Full documentation is hosted at <https://matejchalk.github.io/build-md/>.

## Key features

- ⌨️ Its **intuitive syntax** makes it convenient for generating Markdown from JavaScript/TypeScript code.
  - _Builder pattern_ used for creating Markdown documents.
  - _Tagged template literal_ used for inline Markdown formatting and nesting Markdown blocks.
- 🖺 Has **comprehensive support** for many commonly used Markdown elements.
  - All elements from Markdown's [basic syntax](https://www.markdownguide.org/basic-syntax/) are included.
  - Also supports many elements from [extended syntax](https://www.markdownguide.org/extended-syntax/) (e.g. from [GitHub Flavored Markdown](https://github.github.com/gfm/)).
- 📑 Enables **logical nesting** of Markdown elements and uses **contextual rendering** to ensure output will be rendered correctly.
  - Blocks may contain inline elements or even other blocks (e.g. nested lists), inline elements may contain other inline elements, etc.
  - Each element may be rendered as HTML instead of Markdown if needed. For example, block elements in Markdown tables will automatically render using equivalent HTML tags. And if a parent element is rendered as HTML, so will all its children.
- 🧮 Document builder enables writing **conditional and iterative logic** in a declarative way.
  - Falsy values from regular JavaScript expressions are ignored.
  - Special methods provided for adding multiple related elements conditionally or in a loop.
  - Even for very complex dynamic documents, there should be no need to resort to imperative logic like `if`/`else` branches or `for` loops. But if you prefer this coding style, then its supported in mutable mode (immutable is default).
- 🎀 Markdown output is **well-formatted**.
  - Automatically inserts line breaks and indentation as appropriate. Even Markdown tables are aligned to be more readable.
  - No need to run additional tools like Prettier to have nicely formatted Markdown.

## Quickstart

Install `build-md` with your package manager in the usual way. E.g. to install as a dev dependency using NPM:

```sh
npm install -D build-md
```

Import the [`MarkdownDocument` class](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html), add some basic Markdown blocks and render as string:

```js
import { MarkdownDocument } from 'build-md';

new MarkdownDocument()
  .heading(1, 'Contributing')
  .heading(2, 'Setup')
  .paragraph('Install dependencies with:')
  .code('sh', 'npm install')
  .heading(2, 'Development')
  .list([
    'npm test - run unit tests with Vitest',
    'npm run docs - generate documenation with TypeDoc',
  ])
  .toString();
```

To add inline formatting, import the [`md` tagged template literal](https://matejchalk.github.io/build-md/functions/md.html):

```js
import { MarkdownDocument, md } from 'build-md';

new MarkdownDocument()
  // ...
  .list([
    md`${md.code('npm test')} - run unit tests with ${md.link(
      'https://vitest.dev/',
      'Vitest'
    )}`,
    md`${md.code('npm run docs')} - generate documenation with ${md.link(
      'https://typedoc.org/',
      'TypeDoc'
    )}`,
  ])
  .toString();
```

To see it in action, copy/paste this complete example into a `docs.mjs` file and run `node docs.mjs` to generate a `CONTRIBUTING.md` file:

```js
import { MarkdownDocument, md } from 'build-md';
import { writeFile } from 'node:fs/promises';

const markdown = new MarkdownDocument()
  .heading(1, 'Contributing')
  .heading(2, 'Setup')
  .paragraph('Install dependencies with:')
  .code('sh', 'npm install')
  .heading(2, 'Development')
  .list([
    md`${md.code('npm test')} - run unit tests with ${md.link(
      'https://vitest.dev/',
      'Vitest'
    )}`,
    md`${md.code('npm run docs')} - generate documenation with ${md.link(
      'https://typedoc.org/',
      'TypeDoc'
    )}`,
  ])
  .toString();

await writeFile('CONTRIBUTING.md', markdown);
```
