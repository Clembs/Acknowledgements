import { resolve } from 'path';
import { read } from '../helpers';
import { CreditsMap } from '../types';
import writeCreditsJSON from './json';
import writeCreditsMD from './markdown';

const depNames = new Set<string>();
const allDeps: CreditsMap = new Map();

export async function generate(
  directory: string,
  includeMd: boolean = false,
  includeDevDeps: boolean = false
) {
  const time = Date.now();

  const packageJSONpath = resolve(`${directory}/package.json`);
  const creditsJSONpath = resolve(`${directory}/credits.json`);

  console.log('🔎 Retrieving dependencies...');

  const pjson = JSON.parse(read(packageJSONpath));

  if (!pjson.dependencies) {
    throw new Error('No dependencies found.');
  }
  [
    ...Object.keys(pjson.dependencies ?? {}),
    ...(includeDevDeps ? Object.keys(pjson.devDependencies ?? {}) : []),
  ].forEach((d) => addDependency(d, directory));

  writeCreditsJSON(creditsJSONpath, allDeps);
  console.log(`✅ Wrote to ${creditsJSONpath}`);

  if (includeMd) {
    const mdPath = resolve(`${directory}/CREDITS.md`);
    writeCreditsMD(mdPath, allDeps);

    console.log(`✅ Wrote Markdown to ${mdPath}`);
  }

  console.log(`✨ Done in ${Date.now() - time}ms`);
}

/**
 * Get a dependency from node_modules and add it to the creditsMap.
 * @param dep The dependency to check
 * @returns The name and url of the dependency
 */
function addDependency(dep: string, directory: string): void {
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
  });
}
