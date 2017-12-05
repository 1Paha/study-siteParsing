const parseModels = require('./parseModels');

parseModels('https://phone.1k.by/mobile/')
  .then(() => {
    return parseModels('https://phone.1k.by/mobile/page2');
  });
