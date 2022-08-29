import { resolve } from 'path';
import { color, read } from '../helpers';
import { CreditJSON, CreditsMap, CreditTypes } from '../types';
import writeCreditsCSV from './csv';
import writeCreditsHTML from './html';
import writeCreditsJSON from './json';
import writeCreditsMD from './markdown';
import writeCreditsTOML from './toml';
import writeCreditsYAML from './yaml';

const depNames = new Set<string>();
const allDeps: CreditsMap = new Map();

const writeFormat = {
  json: writeCreditsJSON,
  md: writeCreditsMD,
  yml: writeCreditsYAML,
  toml: writeCreditsTOML,
  html: writeCreditsHTML,
  csv: writeCreditsCSV,
};

export async function generate(
  directory: string,
  formats: {
    json?: true;
    md?: boolean;
    yml?: boolean;
    toml?: boolean;
    html?: boolean;
    csv?: boolean;
  },
  include: {
    devDeps?: boolean;
    types?: boolean;
  } = {
    devDeps: false,
    types: false,
  },
  recursive: boolean = false
) {
  const time = Date.now();

  const packageJSONpath = resolve(`${directory}/package.json`);
  const creditsJSONpath = resolve(`${directory}/credits.json`);

  console.log('🔎 Retrieving dependencies...');

  const credits: CreditJSON[] = JSON.parse(read(creditsJSONpath)) ?? [];
  const pjson = JSON.parse(read(packageJSONpath));

  credits.forEach((credit) => {
    if (credit && credit.type === CreditTypes.ManualCredit) {
      allDeps.set(credit.name, credit);
    }
  });

  if (!pjson.dependencies) {
    throw new Error('No dependencies found.');
  }
  [
    ...Object.keys(pjson.dependencies ?? {}),
    ...(include.devDeps ? Object.keys(pjson.devDependencies ?? {}) : []),
  ]
    .filter(Boolean)
    .forEach((d) => addDependency(d, directory, recursive));

  Object.keys(formats).forEach((f) => {
    const format = f as keyof typeof formats;
    if (!formats[format]) return;

    const path = resolve(`${directory}/credits.${format}`);

    const allCredits = Array.from(allDeps.values()).sort((a, b) => a.name.localeCompare(b.name));

    writeFormat[format](path, allCredits);

    console.log(`📝 Wrote ${color('bold', 'underline')} to ${path}.`, `credits.${format}`);
  });

  console.log(`✨ Credited ${allDeps.size} dependencies in ${Date.now() - time}ms.`);
}

/**
 * Get a dependency from node_modules and add it to the creditsMap.
 * @param dep The dependency to check
 * @returns The name and url of the dependency
 */
function addDependency(dep: string, directory: string, recursive: boolean = false): void {
  if (depNames.has(dep)) {
    return;
  }
  const pjsonPath = resolve(`${directory}/node_modules/${dep}/package.json`);

  const pjson = JSON.parse(read(pjsonPath));

  const version = pjson.version
    .replace(/^\^/, '')
    .replace(/^\~/, '')
    .replace(/^\>/, '')
    .replace(/^\=/, '')
    .replace(/^\>\=/, '')
    .replace(/^\<\=/, '');

  const url = pjson.repository
    ? typeof pjson.repository === 'string'
      ? pjson.repository.replace(/^git\+/, '').replace(/\.git$/, '')
      : pjson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
    : `https://npmjs.com/package/${dep}`;

  allDeps.set(dep, {
    name: dep,
    version,
    license: pjson.license || 'Unknown',
    url,
    type: CreditTypes.Dependency,
  });

  depNames.add(dep);

  if (recursive && pjson.dependencies) {
    Object.keys(pjson.dependencies ?? {}).forEach((d) => addDependency(d, directory, true));
  }
}
