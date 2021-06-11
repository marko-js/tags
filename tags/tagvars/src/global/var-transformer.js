const { getTagDef, isNativeTag } = require("@marko/babel-utils");
const getClosestMeta = require("../components/_component/get-closest-meta");

module.exports = (tag, t) => {
  if (!tag.hub) {
    throw new Error("The `Tags API` preview is only supported in Marko 5");
  }

  const tagVar = tag.node.var;

  if (!tagVar) {
    return;
  }

  const tagDef = getTagDef(tag);
  if (tagDef && tagDef.translator) {
    return;
  }

  if (isNativeTag(tag)) {
    const meta = getClosestMeta(tag);
    const keyAttr = tag
      .get("attributes")
      .find((path) => path.node.name === "key");

    if (keyAttr) {
      throw keyAttr.buildCodeFrameError(
        "The `key` attribute is not supported when using the modern `Tags API`."
      );
    }

    tag.set("var", undefined);
    tag.pushContainer("attributes", t.markoAttribute("key", tagVar));
    tag.insertBefore(
      t.markoScriptlet([
        t.variableDeclaration("var", [
          t.variableDeclarator(
            tagVar,
            t.stringLiteral(`${meta.extra.___refIndex++}`)
          ),
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
  }
};
