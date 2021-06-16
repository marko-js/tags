const eventNameReg = /^on[A-Z]/;
const { isNativeTag } = require("@marko/babel-utils");
const seenAttrs = new WeakSet();

// TODO: ban :scoped, no-update, args
// TODO: warn when lowercased variants used and passed a non string

module.exports = (tag, t) => {
  if (isNativeTag(tag)) {
    for (const attr of tag.get("attributes")) {
      const { node } = attr;

      if (eventNameReg.test(node.name) && node.value && !seenAttrs.has(node)) {
        node.arguments = [node.value];
        node.value = t.booleanLiteral(true);
        seenAttrs.add(node);
      }
    }
  }
};
