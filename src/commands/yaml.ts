import { RegularCharsRegex, write } from '../helpers';
import { CreditJSON, CreditTypes } from '../types';

function writeCreditsYAML(filePath: string, credits: CreditJSON[]) {
  const output = credits
    .map((c) => {
      let output = `- name: ${RegularCharsRegex.test(c.name) ? c.name : `"${c.name}"`}\n  url: ${
        c.url
      }`;

      if (c.type === CreditTypes.Dependency) {
        output += `\n  version: ${c.version}\n  license: ${c.license}`;
      } else {
        output += `\n  author: ${c.author}`;
      }

      return output;
    })
    .join('\n');

  write(filePath, output);
}

export default writeCreditsYAML;
