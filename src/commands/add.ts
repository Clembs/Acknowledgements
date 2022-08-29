import { resolve } from 'path';
import { color, getCreditsJSON } from '../helpers';
import { ManualCredit } from '../types';
import writeCreditsJSON from './json';

export async function add(directory: string, credit: ManualCredit) {
  const creditsJSONpath = resolve(`${directory}/credits.json`);

  const creditsJSON = getCreditsJSON(creditsJSONpath);

  creditsJSON.push(credit);

  writeCreditsJSON(
    creditsJSONpath,
    creditsJSON.sort((a, b) => a.name.localeCompare(b.name))
  );

  console.log(
    `\n✨ Added ${color('bold', 'underline')} to ${color('bold', 'underline')}`,
    credit.name,
    'credits.json'
  );
}
