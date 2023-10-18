const yaml = require('js-yaml');
const fs = require('fs');
const jsonData = require('../extracted-data.json');

const yamlData = yaml.dump(jsonData);

// Write the extracted data to a yaml file
fs.writeFileSync('./repo-settings.yml', yamlData);
