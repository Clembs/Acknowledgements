import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate } from './commands/generate';

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
      .option('markdown', {
        describe: 'Generate a pretty Markdown file.',
        boolean: true,
        alias: 'md',
      });
  },
  (argv) => {
    generate(argv.dir, argv.markdown, argv.includeDev);
  }
);

cli.command('add', 'Adds a new credit to the credits.json file.');

cli.alias({
  v: 'version',
});

cli.demandCommand().strictCommands().strictOptions().strict(true).parse();
