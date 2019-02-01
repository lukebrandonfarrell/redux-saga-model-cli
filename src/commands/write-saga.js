const _ = require('lodash');
const { writeComment, methodMap, writeTypeConsts, formatType } = require('./utilities');

exports.writeSaga = function(name, methods) {
  let nameInCaps = _.upperFirst(_.camelCase(name));
  const nameUppercase = _.upperCase(name);
  const dataComment = writeComment();

  // Generate sagas
  const sagas = _.map(methods, (value, key) => {
    const params = _.get(value, "params", []);
    const meta = _.get(value, "meta", []);
    const plural = key === "index" ? "s" : "";

    return `
      export function* ${methodMap[key]}${nameInCaps}${plural}(action, baseUrl, throwError) {
        try {
          const { ${meta.map((item) => _.camelCase(item)).join(",")} } = action.meta;
          const { ${params.map((item) => _.camelCase(item)).join(",")} } = action.payload;
          const ${_.lowerFirst(nameInCaps)} = yield call(${methodMap[key]}${nameInCaps}${plural}Request, baseUrl, ${meta.join(",")}, ${params.join(",")});
          
          yield put({
            type: ${formatType(methodMap[key], `${nameUppercase}${plural}_RESPONSE`)},
            payload: { data: ${_.lowerFirst(nameInCaps)} },
            error: false
          })
        } catch (e) {
          if(throwError) throwError(e);
        
          yield put({
            type: ${formatType(methodMap[key], `${nameUppercase}${plural}_RESPONSE`)},
            error: true
          });
        }
      }
    `;
  });

  // Generate Types
  const types = writeTypeConsts(methods, nameUppercase);

  // Generate Action Listeners
  const actionListeners = _.map(methods, (value, key) => {
    const plural = key === "index" ? "s" : "";

    return `
      takeLatest(${formatType(methodMap[key], `${nameUppercase}${plural}`)}, action => ${methodMap[key]}${nameInCaps}${plural}(action, baseUrl, throwError)),
    `;
  });

  // Generate API Methods
  const apiMethods = _.map(methods, (value, key) => {
    const plural = key === "index" ? "s" : "";

    return `${methodMap[key]}${nameInCaps}${plural}Request`;
  });

  return dataComment + `    
    import { all, call, put, takeLatest, fork } from "redux-saga/effects";
    import { ${types.join("\n")} } from "./${nameInCaps}Types";
    import { ${apiMethods.join(",")} } from "./${nameInCaps}Api";

    ${sagas.join("\r\n")}

    export default function* ${_.lowerFirst(nameInCaps)}Saga(baseUrl, throwError) {
      yield all([${actionListeners.join("\r\n")}]);
    }
  `;
}