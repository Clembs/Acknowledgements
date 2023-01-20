import { readdirSync, statSync } from 'fs';
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
const allCredits: CreditsMap = new Map();
const packageJSONs: [string, any][] = [];

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

  recursiveFindPackageJSON(directory);

  const creditsJSONpath = resolve(`${directory}/credits.json`);

  console.log('🔎 Retrieving dependencies...');

  const credits: CreditJSON[] = JSON.parse(read(creditsJSONpath)) ?? [];

  credits.forEach((credit) => {
    if (credit && credit.type === CreditTypes.ManualCredit) {
      allCredits.set(credit.name, credit);
    }
  });

  if (!packageJSONs || !packageJSONs.find(([dir, pjson]) => pjson.dependencies)) {
    throw new Error('No dependencies found.');
  }

  packageJSONs.forEach(([dir, pjson]) => {
    [...Object.keys(pjson.dependencies ?? {}), ...Object.keys(pjson.devDependencies ?? {})]
      .filter(Boolean)
      .forEach((d) => addDependency(d, dir, recursive));
  });

  Object.keys(formats).forEach((f) => {
    const format = f as keyof typeof formats;
    if (!formats[format]) return;

    const path = resolve(`${directory}/credits.${format}`);

    const credits = Array.from(allCredits.values()).sort((a, b) => a.name.localeCompare(b.name));

    writeFormat[format](path, credits);

    console.log(`📝 Wrote ${color('bold', 'underline')} to ${path}`, `credits.${format}`);
  });

  console.log(`✨ Credited ${allCredits.size} dependencies in ${Date.now() - time}ms`);
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

  allCredits.set(dep, {
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

function recursiveFindPackageJSON(directory: string) {
  const files = readdirSync(directory);

  const excludeFolders = ['node_modules', 'dist', '.git'];

  files.forEach((file) => {
    const filePath = resolve(`${directory}/${file}`);

    if (excludeFolders.includes(file)) {
      return;
    }
    if (file === 'package.json') {
      packageJSONs.push([directory, JSON.parse(read(filePath))]);
      return;
    }
    if (statSync(filePath).isDirectory()) {
      recursiveFindPackageJSON(resolve(filePath));
      return;
    }
    return;
  });
}
