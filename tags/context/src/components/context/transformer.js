module.exports = function(el, ctx) {
  const { builder } = ctx;

  if (el.params.length) {
    // Receive context tag.
    const fromAttr = el.getAttribute("from");
    let from = fromAttr && fromAttr.literalValue;

    if (from) {
      if (from === ".") {
        from = buildModuleExports(builder);
      } else {
        const fromTag = ctx.taglibLookup.getTag(from);

        if (fromTag) {
          from = ctx.importTemplate(fromTag.template);
        } else {
          return ctx.addError(
            `context receiver could not find context provider matching 'from="${from}"'.`
          );
        }
      }
    } else {
      return ctx.addError(
        "context 'from' attribute is required and should point to another component."
      );
    }

    const getNode = ctx.createNodeForEl("get-context");
    getNode.params = el.params;
    getNode.setAttributeValue("__from", from);
    getNode.body = el.body;
    el.replaceWith(getNode);
  } else {
    // Set context tag.
    setNode = ctx.createNodeForEl("set-context", el.getAttributes());
    setNode.setAttributeValue("__from", buildModuleExports(builder));
    setNode.body = el.body;
    el.replaceWith(setNode);
  }
};

function buildModuleExports(builder) {
  return builder.memberExpression(
    builder.identifier("module"),
    builder.identifier("exports")
  );
}
