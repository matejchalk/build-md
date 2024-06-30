# CLI

| Option | Description |
| --- | --- |
| `-i`, `--input` | Input file path |
| `-o`, `--output` [^1] | Output file path |
| `--version` | Print version and exit |

<details>
<summary>Examples</summary>

- `gendocs --input src/index.ts` - reads input from file and prints to stdout
- `gendocs -i src/index.ts -o docs/API.md` - reads input and output from file
- `gendocs --version` - prints installed version

</details>

## Roadmap

- [x] Markdown output
- [x] HTML output
- [ ] ~~PDF output~~ (not planned)
- [ ] Custom HTML themes

[^1]: Output format determined by file extension.
