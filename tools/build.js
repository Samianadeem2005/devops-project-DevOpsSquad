#!/usr/bin/env node
// Render every Markdown file in a source directory into an HTML page.
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const [srcDir, destDir] = process.argv.slice(2);

if (!srcDir || !destDir) {
  console.error('usage: build.js <source-directory> <destination-directory>');
  process.exit(2);
}

if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
  console.error(`Source directory does not exist: ${srcDir}`);
  process.exit(2);
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const files = fs.readdirSync(srcDir).filter((file) => file.endsWith('.md'));

fs.mkdirSync(destDir, { recursive: true });

for (const file of files) {
  const sourcePath = path.join(srcDir, file);
  const destPath = path.join(destDir, file.replace(/\.md$/, '.html'));
  const body = md.render(fs.readFileSync(sourcePath, 'utf8'));
  const title = path.basename(file, '.md');

  fs.writeFileSync(destPath, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>${title}</title>
${body}</html>
`);

  console.log(`BUILD ${sourcePath} -> ${destPath}`);
}
