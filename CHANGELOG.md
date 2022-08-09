## 1.1.0

- Added `version` prop to JSON output
- Dependencies are now organised alphabetically in JSON output
- Removed `--force` flag
- Removed individual dependency logging
- Rewrote to be way faster using `node_modules` instead of the npm API:
  - Test in [creative-toolkit](/paperdave/creative-toolkit) (`yarn ack dave --include-dev`):
    - `1.0.0`: Done in 12.1s
    - `1.1.0`: Done in 0.39s
- Added execution time to the console output

## 1.0.0

- Initial commit
