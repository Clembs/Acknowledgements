import { readFileSync, writeFileSync } from 'fs';
import { CreditJSON } from './types';

/**
 * Retrieves the contents of credits.json.
 * @param creditsJSONpath Path to the credits.json file.
 * @returns
 */
export function getCreditsJSON(creditsJSONpath: string): CreditJSON[] {
  try {
    const currentCreditsFile = read(creditsJSONpath) || '[]';
    const currentCredits = JSON.parse(currentCreditsFile);
    return currentCredits;
  } catch (e) {
    return [];
  }
}

export function read(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (e) {
    return '';
  }
}

export function write(filePath: string, contents: string): void {
  writeFileSync(filePath, contents, 'utf8');
}
