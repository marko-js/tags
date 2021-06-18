const lifecycle = require("../../global/transformers/lifecycle");

module.exports = (tag, t) => {
  const { node } = tag;
  const tagVar = node.var;

  if (!tagVar) {
    return;
  }

  const meta = lifecycle.closest(tag);
  tag.set("var", undefined);
  tag.pushContainer("attributes", t.markoAttribute("key", tagVar));
  tag.insertBefore(
    t.markoScriptlet([
      t.variableDeclaration("var", [
        t.variableDeclarator(tagVar, t.stringLiteral(`${meta.refIndex++}`)),
      ]),
    ])
  );

  for (const ref of tag.scope.getBinding(tagVar.name).referencePaths) {
    if (!ref.isUpdateExpression()) {
      ref.replaceWith(
        t.callExpression(
          t.memberExpression(meta.component, t.identifier("getEl")),
          [tagVar]
        )
      );
    }
  }
};
