const { importDefault } = require("@marko/babel-utils");
const helperPath = require.resolve("./helper");

module.exports = function translate(tag, t) {
  const { file } = tag.hub;

  if (file.markoOpts.output === "html") {
    tag.remove();
    return;
  }

  const attrs = tag.get("attributes");
  const depsAttr = attrs.find(byAttrName("_deps"));
  const args = [
    file._componentInstanceIdentifier,
    attrs.find(byAttrName("default")).node.value,
  ];

  if (depsAttr) {
    args.push(depsAttr.node.value);
  }

  tag.replaceWith(
    t.callExpression(importDefault(file, helperPath, "effect"), args)
  );
};

function byAttrName(name) {
  return (attr) => attr.node.name === name;
}
