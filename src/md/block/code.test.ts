import { Renderer } from '../renderer';
import { codeBlock } from './code';

describe('code', () => {
  const renderer = new Renderer();

  it('should render code block in markdown', () => {
    expect(codeBlock('npm install build-md').render(renderer)).toBe(
      '```\nnpm install build-md\n```'
    );
  });

  it('should render code block in html', () => {
    expect(codeBlock('npm install build-md').renderAsHtml(renderer)).toBe(
      '<pre><code>npm install build-md</code></pre>'
    );
  });

  it('should include lang in markdown', () => {
    expect(codeBlock('sh', 'npm install build-md').render(renderer)).toBe(
      '```sh\nnpm install build-md\n```'
    );
  });

  it('should use lang attribute in html', () => {
    expect(codeBlock('sh', 'npm install build-md').renderAsHtml(renderer)).toBe(
      '<pre lang="sh"><code>npm install build-md</code></pre>'
    );
  });

  it('should replace new lines in html', () => {
    expect(codeBlock('{\n  "foo": "bar"\n}').renderAsHtml(renderer)).toBe(
      '<pre><code>{&#13;  "foo": "bar"&#13;}</code></pre>'
    );
  });
});
