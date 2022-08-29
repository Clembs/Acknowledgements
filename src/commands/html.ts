import { write } from '../helpers';
import { CreditJSON, CreditTypes } from '../types';

function writeCreditsHTML(filePath: string, credits: CreditJSON[]) {
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Acknowledgements</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #333;
      background-color: #fff;
    }
  </style>
</head>
<body>
  <h1>Acknowledgements</h1>
  <p>These open source libraries, tools, assets are used in this project.</p>

  <ul>
    ${credits
      .map(
        (c) =>
          `<li><a href="${c.url}">${c.name}</a> - ${
            c.type === CreditTypes.Dependency ? c.license : c.author
          }</li>`
      )
      .join('\n')}
  </ul>
</body>
</html>`;

  write(filePath, content);
}

export default writeCreditsHTML;
