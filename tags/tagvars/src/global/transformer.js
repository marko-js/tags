const { isNativeTag } = require("@marko/babel-utils");
const { types: t } = require("@marko/compiler");
const lifecycle = require("../global/transformers/lifecycle");
const nativeTagVar = require("./transformers/native-tag-var");
const nativeEventHandlers = require("./transformers/native-event-handlers");
const checkDeprecations = require("./transformers/check-deprecations");
const visited = new WeakSet();

module.exports = {
  Program: lifecycle.visitor.Program,
  MarkoTag(tag) {
    if (!visited.has(tag.node)) {
      visited.add(tag.node);
      checkDeprecations(tag);
      lifecycle.visitor.MarkoTag(tag);

      if (isNativeTag(tag)) {
        nativeEventHandlers(tag, t);
        nativeTagVar(tag, t);
      } else {
        // TODO: transform custom tag var.
      }
    }
  },
};
