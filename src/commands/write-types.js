const _ = require('lodash');
const { writeComment } = require('./utilities');

exports.writeTypes = function(name) {
  const nameUppercase = _.snakeCase(name).toUpperCase();
  const dataComment = writeComment();

  return dataComment + `    
    export const FETCH_${nameUppercase} = "FETCH_${nameUppercase}";
    export const CREATE_${nameUppercase} = "CREATE_${nameUppercase}";
    export const UPDATE_${nameUppercase} = "UPDATE_${nameUppercase}";
    export const DELETE_${nameUppercase} = "DELETE_${nameUppercase}";
    export const FETCH_${nameUppercase}_RESPONSE = "FETCH_${nameUppercase}_RESPONSE";
    export const CREATE_${nameUppercase}_RESPONSE = "CREATE_${nameUppercase}_RESPONSE";
    export const UPDATE_${nameUppercase}_RESPONSE = "UPDATE_${nameUppercase}_RESPONSE";
    export const DELETE_${nameUppercase}_RESPONSE = "DELETE_${nameUppercase}_RESPONSE";
  `;
};