const {Command} = require('@oclif/command')
const {cli} = require('cli-ux');
const _ = require('lodash');
const fse = require('fs-extra');
const { writeSaga } = require('./write-saga');
const { writeTypes } = require('./write-types');
const shell = require('shelljs');

class SagasCommand extends Command {
  async run() {
    const inputPath = await cli.prompt('Directory of your JSON file?');
    const outputPath = await cli.prompt('Directory of output?');
    const JSON = require(inputPath);
    const MODELS = JSON['models'];

    _.map(MODELS, (value, key) => {
      const folder = key;
      let fileName = _.upperFirst(_.camelCase(folder));
      fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
      const fileSaga = fileName + "Saga.js";
      const fileTypes = fileName + "Types.js";
      const fileApi = fileName + "Api.js";
      const dataSaga = writeSaga(folder, JSON['models'][key]["methods"]);
      const dataTypes = writeTypes(folder);

      // Touch file with model name
      fse.outputFileSync(`${outputPath}/${folder}/${fileSaga}`, dataSaga, { flag: "w" });
      fse.outputFileSync(`${outputPath}/${folder}/${fileTypes}`, dataTypes, { flag: "w" });
      fse.outputFileSync(`${outputPath}/${folder}/${fileApi}`, "", { flag: "w" });
    });

    shell.exec(`prettier --write ${outputPath}/**/*.js`);
  }
}

SagasCommand.description = `Generates Sagas, Types and API methods from a JSON file.`;

module.exports = SagasCommand;
