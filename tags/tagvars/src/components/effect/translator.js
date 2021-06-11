const { importDefault } = require("@marko/babel-utils");
const helperPath = require.resolve("./helper");
const depsVisitor = {
  MemberExpression(path, deps) {
    const name = path.node.object.name;
    if (name === "input" || name === "state") {
      deps.push(path.node);
    }
  },
  Function(path) {
    path.skip();
  },
};

module.exports = function translate(tag, t) {
  const { file } = tag.hub;
  const defaultAttr = tag
    .get("attributes")
    .find((attr) => attr.node.name === "default");

  if (!defaultAttr.node) {
    throw tag
      .get("name")
      .buildCodeFrameError("effect requires being assigned a value.");
  }

  if (file.markoOpts.output === "html") {
    tag.remove();
  } else {
    const deps = [];
    defaultAttr.get("value").traverse(depsVisitor, deps);
    tag.replaceWith(
      t.callExpression(importDefault(file, helperPath, "effect"), [
        file._componentInstanceIdentifier,
        defaultAttr.node.value,
        t.arrayExpression(deps),
      ])
    );
  }
};
