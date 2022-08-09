# Acknowledgements

✨ Properly credit deps and assets in your projects in a pretty way.

## About

Acknowledgments is a CLI tool that generates a JSON file with a list of all the local dependencies from `package.json`, and a Markdown file if specified.

See it in action: [credits.json](/credits.json), [CREDITS.md](/CREDITS.md)

## Installation

```sh
npm install acknowledgements
# OR
yarn add acknowledgements
# OR
pnpm add acknowledgements
```

## Usage

```sh
# From the root of the project
npx ack
# With a specified folder
npx ack packages/my-package
```

By default, the CLI will generate a JSON file with the list of dependencies and a Markdown file with the list of dependencies.

If you want to generate a pretty CREDITS.md file, you can use the `--markdown` flag.

```sh
npx ack --markdown # or --md
```

Acknowledgements skips `devDependencies` by default. To include them, use the `--include-dev` flag.

```sh
npx ack --include-dev # or -D
```

## Roadmap

- [ ] Have an actual README
- [ ] Command to manually add new stuff to credit
- [ ] Option to ignore @types/ devDependencies in credits
- [ ] Customize Markdown header
- [ ] Node API
- [ ] Support monorepo merging to one file
- [ ] Support CSV output, MD only, etc...
- [ ] Support multiple files
- [ ] Progress bars in the console
- [ ] Support for non-Node projects
- [ ] Recursively find dependencies' dependencies
