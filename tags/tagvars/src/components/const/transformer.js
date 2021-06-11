module.exports = function transform(tag, t) {
  const tagVar = tag.node.var;
  const defaultAttr = tag.node.attributes.find(
    (attr) => attr.name === "default"
  );

  if (!defaultAttr) {
    throw tag
      .get("name")
      .buildCodeFrameError("<const> must be initialized with a value.");
  }

  if (!tagVar) {
    throw tag
      .get("name")
      .buildCodeFrameError(
        "<const> requires a tag variable to be assigned to."
      );
  }

  tag.replaceWith(
    t.markoScriptlet([
      t.variableDeclaration("const", [
        t.variableDeclarator(tagVar, defaultAttr.value),
      ]),
    ])
  );
};
