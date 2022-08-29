import { write } from '../helpers';
import { CreditJSON } from '../types';

function writeCreditsJSON(filePath: string, credits: CreditJSON[]) {
  try {
    write(filePath, JSON.stringify(credits, null, 2));
  } catch (e) {
    throw new Error(String(e));
  }
}

export default writeCreditsJSON;
