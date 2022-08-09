import { write } from '../helpers';
import { CreditsMap } from '../types';

function writeCreditsJSON(filePath: string, credits: CreditsMap) {
  const creditsArray = Array.from(credits.values());
  try {
    write(
      filePath,
      JSON.stringify(
        creditsArray.sort((a, b) => a.name.localeCompare(b.name)),
        null,
        2
      )
    );
  } catch (e) {
    throw new Error(String(e));
  }
}

export default writeCreditsJSON;
