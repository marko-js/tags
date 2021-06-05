const {
  getKeyManager,
} = require("@marko/translator-default/dist/util/key-manager");
const { isNativeTag, isDynamicTag } = require("@marko/babel-utils");

module.exports = function (a, b) {
  (a.hub ? marko5Transform : marko4Transform)(a, b);
};

function marko5Transform(path, t) {
  const tagVar = path.get("var");
  if (tagVar.node && isNativeTag(path)) {
    getKeyManager(path).resolveKey(path);
    const refVar = t.markoScriptlet([
      t.variableDeclaration("const", [
        t.variableDeclarator(tagVar.node, path.get("key").node),
      ]),
    ]);

    const binding = path.scope.getBinding(tagVar.node.name);
    binding.referencePaths.forEach((path) => {
      if (!t.isUpdateExpression(path.node)) {
        path.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.identifier("component"),
              t.identifier("getEl")
            ),
            [tagVar.node]
          )
        );
      }
    });

    path.set("var", undefined);
    path.insertBefore(refVar);
    // path.hub.file.path.unshiftContainer("body", refVar);
  }
}

function marko4Transform(el, ctx) {
  throw new Error("Tag Variable refs are not currently supported in Marko 4.");
}
