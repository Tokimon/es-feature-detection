const { dirname } = require('path');
const { writeFile, mkdir } = require('fs').promises;

module.exports = (path, imports, body) => {
  const content = `${imports.join('\n')}

${body}
`;

  return mkdir(dirname(path), { recursive: true })
    .then(() => writeFile(path, content));
}
