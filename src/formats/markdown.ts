import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { DependencyJSON } from './json.js';

function writeMdForCredits(credits: DependencyJSON[], directory: string) {
  const newFile = resolve(`${directory}/CREDITS.md`);

  const header =
    '# Acknowledgments and credits\n\nThese open source libraries, tools, assets are used in this project.\nAutogenerated by [acknowledgements](https://github.com/Clembs/acknowledgements).\n';

  const markdown = `${header}
  | Name          | License |
  | ------------- | ------- |
  ${credits
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => `| [${c.name}](${c.url}) | ${c.license} |`)
    .join('\n')}
  `;

  writeFileSync(newFile, markdown, 'utf-8');
}

export default writeMdForCredits;
