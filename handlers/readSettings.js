"use strict";
 
const fs = require("fs");
const yaml = require('js-yaml');

module.exports = {

   settings: () => {

      const settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
      
      return settings;
   }
}
