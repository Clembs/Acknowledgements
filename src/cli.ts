import prompts from 'prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { add } from './commands/add';
import { generate } from './commands/generate';
import { color, UrlRegex } from './helpers';
import { CreditTypes } from './types';

const cli = yargs(hideBin(process.argv)).scriptName('ack');

cli.command(
  '$0 [dir]',
  'Generates a credits.json file off the package.json.',
  (yargs) => {
    return yargs
      .positional('dir', {
        type: 'string',
        describe: 'Where to write the credits.json file.',
        default: '.',
      })
      .option('include-dev', {
        describe: 'Include devDependencies in the credits',
        boolean: true,
        alias: 'D',
      })
      .option('formats', {
        describe: 'Which formats to generate (JSON is always generated).',
        choices: ['md', 'yml', 'toml', 'html', 'csv'],
        array: true,
        alias: 'F',
      })
      .option('recursive', {
        describe: 'Recursively search for package.json files in other dependencies.',
        boolean: true,
        alias: 'R',
      });
  },
  (args) => {
    generate(
      args.dir,
      {
        ...args.formats?.reduce((formats, format) => {
          formats[format] = true;
          return formats;
        }, {} as any),
        json: true,
      },
      {
        devDeps: args.includeDev,
      },
      args.recursive
    );
  }
);

cli.command(
  'add',
  'Adds a new credit to the credits.json file.',
  (yargs) => {},
  async (args) => {
    console.log(color('bold', 'yellow'), '✨ Acknowledgements - New credit', '\n');

    const response = await prompts(
      [
        {
          type: 'text',
          name: 'name',
          min: 1,
          message: 'What do you want to credit?',
        },
        {
          type: 'text',
          name: 'author',
          message: `What's the author to credit?`,
          min: 2,
        },
        {
          type: 'text',
          name: 'url',
          validate: (url) => url.length === 0 || UrlRegex.test(url),
          message: 'What URL to credit? (optional)',
        },
      ],
      {
        onCancel: () => {
          console.log(color('red'), '❌ Process aborted.');
          process.exit(1);
        },
      }
    );

    await add('.', {
      ...response,
      type: CreditTypes.ManualCredit,
    });
  }
);

cli.alias({ v: 'version' });

cli.demandCommand().strictCommands().strictOptions().strict(true).parse();
