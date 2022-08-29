import { write } from '../helpers';
import { CreditJSON, CreditTypes } from '../types';

function writeCreditsCSV(filePath: string, credits: CreditJSON[]) {
  const header = `Name,License,URL,Version`;

  const csv = `${header}\n${credits
    .map((c) => {
      if (c.type === CreditTypes.Dependency) {
        return `${c.name},${c.license},${c.url},${c.version}`;
      } else {
        return `${c.name}, ,${c.url},`;
      }
    })
    .join('\n')}`;

  write(filePath, csv);
}

export default writeCreditsCSV;
