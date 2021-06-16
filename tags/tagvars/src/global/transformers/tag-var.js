const { getTagDef, isNativeTag } = require("@marko/babel-utils");
const getClosestMeta = require("../../util/get-closest-meta");
const ensureLifecycle = require("../../util/ensure-lifecycle");

module.exports = (tag, t) => {
  const { node } = tag;
  const tagVar = node.var;

  if (!tagVar) {
    return;
  }

  const tagDef = getTagDef(tag);
  if (tagDef && tagDef.translator) {
    return;
  }

  if (isNativeTag(tag)) {
    ensureLifecycle(tag);

    const meta = getClosestMeta(tag);
    const keyAttr = tag.get("attributes").find(byAttrName("key"));

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

function byAttrName(name) {
  return (attr) => attr.node.name === name;
}
