const deepFreeze = require("../../util/deep-freeze/transform");

module.exports = function transform(tag, t) {
  const tagVar = tag.node.var;
  const defaultAttr = tag.node.attributes.find((it) => it.name === "default");

  if (!tagVar) {
    throw tag
      .get("name")
      .buildCodeFrameError(
        "<const> requires a tag variable to be assigned to."
      );
  }

  if (!defaultAttr) {
    throw tag
      .get("name")
      .buildCodeFrameError("<const> must be initialized with a value.");
  }

  tag.replaceWith(
    t.variableDeclaration("const", [
      t.variableDeclarator(tagVar, deepFreeze(tag.hub.file, defaultAttr.value)),
    ])
  );
};
