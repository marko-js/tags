const { types: t } = require("@marko/compiler");
const { importDefault } = require("@marko/babel-utils");
const runtimePath = require.resolve(".");

module.exports = (file, value) => {
  if (file.markoOpts.optimize || t.isLiteral(value)) {
    return value;
  }

  return t.callExpression(importDefault(file, runtimePath, "freeze"), [value]);
};
