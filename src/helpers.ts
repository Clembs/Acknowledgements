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

export const RegularCharsRegex = /^[a-zA-Z0-9_-]+$/;

export const UrlRegex = /(https?:\/\/[^\s]+)/g;

const TerminalStyles = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  underline: '\x1b[4m',
};

export function color(...styles: (keyof typeof TerminalStyles)[]) {
  return `${styles.map((s) => TerminalStyles[s]).join('')}%s${TerminalStyles.reset}`;
}
