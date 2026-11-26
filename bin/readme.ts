// Regenerates the feature list in README.md (between the feature markers) from the src/esXXXX.ts files.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const sections = ['builtins', 'localization', 'syntax'] as const;
const start = '<!-- features:start -->';
const end = '<!-- features:end -->';

const editions = (await readdir(join(root, 'src')))
  .filter((f) => /^es\d{4}\.ts$/.test(f))
  .sort();

let list = '';
for (const file of editions) {
  const mod = await import(join(root, 'src', file));
  list += `\n### ${file.slice(0, -3).toUpperCase()}\n\n| Feature | Import |\n| --- | --- |\n`;
  for (const section of sections) {
    for (const name of Object.keys(mod[section]?.() ?? {})) {
      list += `| \`${name}\` | \`es-feature-detection/${section}/${name}\` |\n`;
    }
  }
}

const readmePath = join(root, 'README.md');
const readme = await readFile(readmePath, 'utf8');
const [before, rest] = readme.split(start);
if (rest === undefined || !rest.includes(end)) {
  throw new Error(`README.md is missing the ${start} / ${end} markers`);
}
const after = rest.slice(rest.indexOf(end));

await writeFile(readmePath, `${before}${start}\n${list}\n${after}`);
console.log('README.md feature list updated');
