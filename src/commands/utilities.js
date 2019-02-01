const _ = require('lodash');

const methodMap = {
  index: "fetch",
  show: "fetch",
  store: "create",
  update: "update",
  destroy: "delete",
};

const formatType = function(method, name) {
  const format = (value) => _.snakeCase(value).toUpperCase();
  return format(`${method.toUpperCase()}_${name}`);
};

exports.writeComment = function() {
  return `
    /**
     * ----------------------------------------------------
     *      Generated with Ashleigh Redux Generator
     * ----------------------------------------------------
     */
  `;
};

exports.writeTypeConsts = function(methods, name) {
  return _.map(methods, (value, key) => {
    const plural = key === "index" ? "s" : "";

    return `
      ${formatType(methodMap[key], `${name}${plural}`)},
      ${formatType(methodMap[key], `${name}${plural}_RESPONSE`)},
    `;
  });
};

exports.formatType = formatType;
exports.methodMap = methodMap;