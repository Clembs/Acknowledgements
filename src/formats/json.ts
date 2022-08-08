import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fetch } from 'undici';
import generateMd from './markdown';

export interface DependencyJSON {
  name: string;
  url: string;
  license: string;
}

export function getCurrentCredits(directory: string): DependencyJSON[] {
  try {
    const currentCreditsFile = readFileSync(directory, 'utf8') || '[]';
    const currentCredits = JSON.parse(currentCreditsFile);
    return currentCredits;
  } catch (e) {
    return [];
  }
}

const dependencies: [string, string][] = [];
const newDeps: DependencyJSON[] = [];
const allDeps: DependencyJSON[] = [];

async function generateToJSON(
  directory: string,
  printMd: boolean = false,
  includeDevDeps: boolean = false,
  forceFetch: boolean = false
) {
  const packageJSONpath = resolve(`${directory}/package.json`);
  const creditsJSONpath = resolve(`${directory}/credits.json`);
  const currentCredits = getCurrentCredits(creditsJSONpath);

  console.log('Retrieving dependencies...');

  try {
    const pjson = JSON.parse(readFileSync(packageJSONpath, 'utf8'));

    if (!pjson.dependencies) {
      throw new Error('No dependencies found.');
    }

    dependencies.push(
      ...(Object.entries(pjson.dependencies) as [string, string][])
    );

    if (includeDevDeps) {
      dependencies.push(
        ...(Object.entries(pjson.devDependencies) as [string, string][])
      );
    }

    for (const [name, ver] of dependencies) {
      const depInCredits = currentCredits.find((c) => c.name === name);

      if (!forceFetch && depInCredits) {
        allDeps.push(depInCredits);
        continue;
      }

      const npm = await fetchDependency([name, ver]);
      console.log(`✅ [${name}] Data retrieved`);
      allDeps.push(npm);
      newDeps.push(npm);
      await writeCredits(creditsJSONpath);
      console.log(`✅ [${name}] Written to credits.json`);
    }
  } catch (e) {
    console.log(e);
  }

  if (newDeps.length === 0) {
    console.log(
      'No new dependencies found. To force a fetch, use the --force flag.'
    );
  } else {
    console.log(`Resolved ${newDeps.length} dependencies.`);
  }

  if (printMd) {
    generateMd(allDeps, directory);

    console.log(`✅ [CREDITS.md] Written to ${directory}/CREDITS.md`);
  }
}

/**
 * This function will fetch a dependency from npm and return the name and url.
 * @param {string} dependency The dependency to check
 * @returns {Promise<DependencyJSON>} The name and url of the dependency
 */
async function fetchDependency([name, version]: [
  string,
  string
]): Promise<DependencyJSON> {
  const url = `https://registry.npmjs.org/${encodeURI(name)}`;
  try {
    const req = await fetch(url);
    const res = (await req.json()) as any;
    const ver = version
      .replace(/^\^/, '')
      .replace(/^\~/, '')
      .replace(/^\>/, '')
      .replace(/^\=/, '')
      .replace(/^\>\=/, '')
      .replace(/^\<\=/, '');

    if (name === '@paperdave/logger') {
      console.log(res.versions[ver], ver);
    }
    const license = res.versions[ver].license || 'Unknown';
    const repo =
      (res.versions[ver]?.repository
        ? res.repository.url.replace(/^git\+(.*).git/, '$1')
        : res.versions[ver]?.homepage) || '';

    return {
      name,
      url: repo,
      license,
    };
  } catch (e) {
    throw new Error(String(e));
  }
}

async function writeCredits(creditsJSONpath: string) {
  try {
    writeFileSync(creditsJSONpath, JSON.stringify(allDeps, null, 2));
  } catch (e) {
    throw new Error(String(e));
  }
}

export default generateToJSON;
