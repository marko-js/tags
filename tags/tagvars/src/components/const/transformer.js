module.exports = function (a, b) {
  (a.hub ? marko5Transform : marko4Transform)(a, b);
};

function marko5Transform(path, t) {
  const defaultAttr = path
    .get("attributes")
    .find((attr) => attr.node.name === "default");

  const tagVar = path.get("var");

  if (!defaultAttr) {
    throw path
      .get("name")
      .buildCodeFrameError("const requires being assigned a value.");
  }

  if (!tagVar) {
    throw path
      .get("name")
      .buildCodeFrameError("const requires a variable to be assigned to.");
  }

  const scriplet = t.markoScriptlet([
    t.variableDeclaration("const", [
      t.variableDeclarator(tagVar.node, defaultAttr.node.value),
    ]),
  ]);

  path.replaceWith(scriplet);
}

function marko4Transform(el, ctx) {
  throw new Error("<const> tag is not currently supported in Marko 4.");
}
