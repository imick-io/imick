import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

// Strip MDX-specific syntax that remark doesn't understand
function stripMdx(content: string): string {
  return content
    .replace(/^import\s+.*$/gm, "")
    .replace(/^export\s+.*$/gm, "")
    .replace(/<([A-Z][a-zA-Z]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g, "")
    .replace(/<([A-Z][a-zA-Z]*)(?:\s[^>]*)?\s*\/>/g, "")
    .trim()
}

export async function mdxToHtml(content: string): Promise<string> {
  const markdown = stripMdx(content)
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return String(result)
}
