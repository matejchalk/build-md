# build-md

[![npm](https://img.shields.io/npm/v/build-md.svg)](https://www.npmjs.com/package/build-md)
[![CI](https://github.com/matejchalk/build-md/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/matejchalk/build-md/actions/workflows/ci.yml?query=branch%3Amain)
[![codecov](https://codecov.io/github/matejchalk/build-md/graph/badge.svg?token=L9BONN6LRT)](https://codecov.io/github/matejchalk/build-md)

Comprehensive **Markdown builder** for JavaScript/TypeScript.

![Diagram](./images/diagram.png)

📖 Full documentation is hosted at <https://matejchalk.github.io/build-md/>.

## ⭐ Key features

- ✍️ Its **intuitive syntax** makes it convenient for generating Markdown from JavaScript/TypeScript code.
  - [Builder pattern](https://refactoring.guru/design-patterns/builder) used for creating Markdown documents.
  - [Tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) used for inline Markdown formatting and nesting Markdown blocks.
- ✅ Has **comprehensive support** for most commonly used Markdown elements.
  - All elements from Markdown's [basic syntax](https://www.markdownguide.org/basic-syntax/) are included.
  - Also supports many elements from [extended syntax](https://www.markdownguide.org/extended-syntax/) (e.g. from [GitHub Flavored Markdown](https://github.github.com/gfm/)).
  - 📖 See [List of all supported Markdown elements](#-list-of-supported-markdown-elements).
- 🗂️ Enables **logical nesting** of Markdown elements and uses **contextual rendering** to ensure output will be rendered correctly.
  - Blocks may contain inline elements or even other blocks (e.g. nested lists), inline elements may contain other inline elements, etc.
  - Each element may be rendered as HTML instead of Markdown if needed. For example, block elements in Markdown tables will automatically render using equivalent HTML tags. And if a parent element is rendered as HTML, so will all its children.
- 🧮 Document builder enables writing **conditional and iterative logic** in a declarative way.
  - Falsy values from regular JavaScript expressions are ignored.
  - Special methods provided for adding multiple related elements conditionally or in a loop.
  - Even for very complex dynamic documents, there should be no need to resort to imperative logic like `if`/`else` branches or `for` loops. But if you prefer this coding style, then its supported in mutable mode (immutable is default).
  - 📖 See [Dynamic content](#-dynamic-content).
- 🎀 Markdown output is **well-formatted**.
  - Automatically inserts line breaks and indentation when appropriate. Even Markdown tables are aligned to be more readable.
  - No need to run additional tools like Prettier to have nicely formatted Markdown.
- ♻️ Is lightweight with zero dependencies, as well as being completely **runtime agnostic** with regards to browser vs Node, CJS vs ESM, etc.

## 🚀 Quickstart

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

## 📋 List of supported Markdown elements

| Element            | Usage                                                                                                                                                                                                                          | Example                                                                                                                                                                |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bold               | [`md.bold(text)`](https://matejchalk.github.io/build-md/functions/md.html#bold)                                                                                                                                                | **important text**                                                                                                                                                     |
| Italic             | [`md.italic(text)`](https://matejchalk.github.io/build-md/functions/md.html#italic)                                                                                                                                            | _emphasized text_                                                                                                                                                      |
| Link               | [`md.link(href, text?, title?)`](https://matejchalk.github.io/build-md/functions/md.html#link)                                                                                                                                 | [link](#list-of-supported-markdown-elements)                                                                                                                           |
| Image              | [`md.image(src, alt)`](https://matejchalk.github.io/build-md/functions/md.html#image)                                                                                                                                          | ![image](https://img.shields.io/badge/🖼️_image-lightgreen)                                                                                                             |
| Code               | [`md.code(text)`](https://matejchalk.github.io/build-md/functions/md.html#code)                                                                                                                                                | `source_code`                                                                                                                                                          |
| Strikethrough [^1] | [`md.strikethrough(text)`](https://matejchalk.github.io/build-md/functions/md.html#strikethrough)                                                                                                                              | ~~crossed out~~                                                                                                                                                        |
| Footnote [^1]      | [`md.footnote(text, label?)`](https://matejchalk.github.io/build-md/functions/md.html#footnote)                                                                                                                                | [^2]                                                                                                                                                                   |
| Heading            | [`MarkdownDocument#heading(level, text)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#heading)<br />[`md.heading(level, text)`](https://matejchalk.github.io/build-md/functions/md.html#heading)       | <h2>Title</h2>                                                                                                                                                         |
| Paragraph          | [`MarkdownDocument#paragraph(text)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#paragraph)<br />[`md.paragraph(text)`](https://matejchalk.github.io/build-md/functions/md.html#paragraph)             | <p>Some long text spanning a few sentences.</p>                                                                                                                        |
| Code block         | [`MarkdownDocument#code(lang?, text)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#code)<br />[`md.codeBlock(lang?, text)`](https://matejchalk.github.io/build-md/functions/md.html#codeBlock)         | <pre lang="js"><code>sourceCode({&#13; &#160;multiLine: true,&#13; &#160;syntaxHighlighting: true&#13;})</code></pre>                                                  |
| Horizontal rule    | [`MarkdownDocument#rule()`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#rule)<br />[`md.rule()`](https://matejchalk.github.io/build-md/functions/md.html#rule)                                         | <hr />                                                                                                                                                                 |
| Blockquote         | [`MarkdownDocument#quote(text)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#quote)<br />[`md.quote(text)`](https://matejchalk.github.io/build-md/functions/md.html#quote)                             | <blockquote>interesting quote</blockquote>                                                                                                                             |
| Unordered list     | [`MarkdownDocument#list(items)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#list)<br />[`md.list(items)`](https://matejchalk.github.io/build-md/functions/md.html#list)                               | <ul><li>list item 1</li><li>list item 2</li></ul>                                                                                                                      |
| Ordered list       | [`MarkdownDocument#list('ordered', items)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#list)<br />[`md.list('ordered', items)`](https://matejchalk.github.io/build-md/functions/md.html#list)         | <ol><li>list item 1</li><li>list item 2</li></ol>                                                                                                                      |
| Task list [^1]     | [`MarkdownDocument#list('task', items)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#list)<br />[`md.list('task', items)`](https://matejchalk.github.io/build-md/functions/md.html#list)               | &#x2611; list item 1<br />&#x2610; list item 2                                                                                                                         |
| Table [^1]         | [`MarkdownDocument#table(columns, rows)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#table)<br />[`md.table(columns, rows)`](https://matejchalk.github.io/build-md/functions/md.html#table)           | <table><tr><th>heading 1</th><th>heading 2</th></tr><tr><td>row 1, col. 1</td><td>row 1, col. 2</td></tr><tr><td>row 2, col. 1</td><td>row 2, col. 2</td></tr></table> |
| Details [^3]       | [`MarkdownDocument#details(summary?, text)`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#details)<br />[`md.details(summary?, text)`](https://matejchalk.github.io/build-md/functions/md.html#details) | <details>expandable content</details>                                                                                                                                  |

[^1]: Not part of basic Markdown syntax, but supported by some Markdown extensions like GFM.
[^2]: Footnotes render a label in place of insertion, as well as appending a block to the end of the document with the content.
[^3]: Always rendered as HTML.

## 🥽 Diving in

### 🧩 Dynamic content

While the [Quickstart](#-quickstart) example shows how to render static Markdown, the main purpose of a Markdown builder is to generate content dynamically. The `MarkdownDocument` class is designed for writing conditional or iterative logic in a simple and declarative way, without having to break out of the builder chain.

For starters, document blocks with empty content are automatically skipped. So if the expression you write for a top-level block's content evaluates to some empty value (falsy or empty array), then the block won't be appended to the document.

```ts
function createMarkdownComment(
  totalCount: number,
  passedCount: number,
  logsUrl: string | null,
  failedChecks?: string[]
): string {
  return (
    new MarkdownDocument()
      .heading(1, `🛡️ Quality gate - ${passedCount}/${totalCount}`)
      // 👇 `false` will skip quote
      .quote(passedCount === totalCount && '✅ Everything in order!')
      // 👇 `undefined` or `0` will skip heading
      .heading(2, failedChecks?.length && '❌ Failed checks')
      // 👇 `undefined` or `[]` will skip list
      .list(failedChecks?.map(md.code))
      // 👇 `""` or `null` will skip paragraph
      .paragraph(logsUrl && md.link(logsUrl, '🔗 CI logs'))
      .toString()
  );
}
```

### 🧮 Control flow methods

The conditional expressions approach outlined above is convenient for toggling individual blocks. But if your logic affects multiple blocks at once, you may reach instead for one of the provided control flow methods – [`$if`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#_if) and [`$foreach`](https://matejchalk.github.io/build-md/classes/MarkdownDocument.html#_foreach).

The `$if` method is useful for subjecting multiple blocks to a single condition. Provide a callback function which returns the `MarkdownDocument` instance with added blocks. This callback will only be used if the condition is `true`.

```ts
new MarkdownDocument()
  .heading(1, `🛡️ Quality gate - ${passedCount}/${totalCount}`)
  .quote(passedCount === totalCount && '✅ Everything in order!')
  // 👇 heading and list added if `passedCount < totalCount`, otherwise both skipped
  .$if(passedCount < totalCount, doc =>
    doc.heading(2, '❌ Failed checks').list(failedChecks?.map(md.code))
  )
  .paragraph(logsUrl && md.link(logsUrl, '🔗 CI logs'))
  .toString();
```

Optionally, you may provide another callback which will be used if the condition is `false` (think of it as the `else`-branch).

```ts
new MarkdownDocument()
  .heading(1, `🛡️ Quality gate - ${passedCount}/${totalCount}`)
  .$if(
    passedCount === totalCount,
    // 👇 quote added if `passedCount === totalCount` is true
    doc => doc.quote('✅ Everything in order!'),
    // 👇 heading and list added if `passedCount === totalCount` is false
    doc => doc.heading(2, '❌ Failed checks').list(failedChecks?.map(md.code))
  )
  .paragraph(logsUrl && md.link(logsUrl, '🔗 CI logs'))
  .toString();
```

When it comes to iterative logic, then for individual blocks like lists and tables you can use the usual array methods (`.map`, `.filter`, etc.) to make the content dynamic. But if you need to generate multiple blocks per array item, the `$foreach` method comes in handy.

Provide an array for the 1st argument, and a callback for the 2nd. The callback function is called for each item in the array, and is expected to add blocks to the current `MarkdownDocument` instance.

```ts
function createMarkdownCommentForMonorepo(
  projects: {
    name: string;
    totalCount: number;
    passedCount: number;
    logsUrl: string | null;
    failedChecks?: string[];
  }[]
): string {
  return new MarkdownDocument()
    .heading(1, `🛡️ Quality gate (${projects.length} projects)`)
    .$foreach(
      projects,
      (doc, { name, totalCount, passedCount, logsUrl, failedChecks }) =>
        doc
          .heading(2, `💼 ${name} - ${passedCount}/${totalCount}`)
          .$if(
            passedCount === totalCount,
            doc => doc.quote('✅ Everything in order!'),
            doc =>
              doc
                .heading(3, '❌ Failed checks')
                .list(failedChecks?.map(md.code))
          )
          .paragraph(logsUrl && md.link(logsUrl, '🔗 CI logs'))
    )
    .toString();
}
```

#### 🧊 Immutable vs mutable

By default, instances of `MarkdownDocument` are immutable. Methods for appending document blocks return a new instance, leaving the original instance unaffected.

```ts
// 👇 `extendedDocument` has additional blocks, `baseDocument` unmodified
const extendedDocument = baseDocument
  .rule()
  .paragraph(md`Made with ❤️ by ${md.link(OWNER_LINK, OWNER_NAME)}`);
```

This is an intentional design decision to encourage building Markdown documents declaratively, instead of an imperative approach using `if`/`else` branches, `for` loops, etc.

However, if you prefer to write your logic imperatively, then you have the option of setting `mutable: true` when instantiating a document.

```ts
function createMarkdownCommentForMonorepo(
  projects: {
    name: string;
    totalCount: number;
    passedCount: number;
    logsUrl: string | null;
    failedChecks?: string[];
  }[]
): string {
  // 👇 all method calls will mutate document
  const doc = new MarkdownDocument({ mutable: true });

  // 👇 ignoring return value would have no effect in immutable mode
  doc.heading(1, `🛡️ Quality gate (${projects.length} projects)`);

  // 👇 imperative loops work because of side-effects
  for (const project of projects) {
    const { name, totalCount, passedCount, logsUrl, failedChecks } = project;

    doc.heading(2, `💼 ${name} - ${passedCount}/${totalCount}`);

    // 👇 imperative conditions work because of side-effects
    if (passedCount === totalCount) {
      doc.quote('✅ Everything in order!');
    } else {
      doc.heading(3, '❌ Failed checks').list(failedChecks?.map(md.code));
    }

    if (logsUrl) {
      doc.paragraph(md.link(logsUrl, '🔗 CI logs'));
    }
  }

  return doc.toString();
}
```

### 📝 Inline formatting

The `md` tagged template literal is for composing text which includes Markdown elements.
It provides an intuitive syntax for adding inline formatting, as well as embedding nested blocks within top-level document blocks.
Its output is embeddable into all elements (with a few logical exceptions like code blocks), so it acts as the glue for building documents with a complex hierarchy.

It also comes in handy when you don't want to render a full document, but only need a one-line Markdown string. Just like for the `MarkdownDocument` class, calling `.toString()` returns the converted Markdown text.

```ts
md`${md.bold(severity)} severity vulnerability in ${md.code(name)}`.toString();
```

## 🤝 Contributing

- Prerequisite is having Node.js installed.
- Install dev dependencies with `npm install`.
- Run tests with `npm test` or `npm run test:watch` (uses [Vitest](https://vitest.dev/)).
- Generate documentation with `npm run docs` (uses [TypeDoc](https://typedoc.org/)).
- Compile TypeScript sources with `npm run build` (uses [tsup](https://tsup.egoist.dev/)).
- Use [Conventional Commits](https://www.conventionalcommits.org/) prompts with `npm run commit`.
