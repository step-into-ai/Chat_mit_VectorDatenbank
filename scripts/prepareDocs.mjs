import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const docsDir = join(process.cwd(), 'docs');

mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, '.nojekyll'), '', 'utf8');
