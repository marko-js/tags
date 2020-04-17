module.exports = function(el, ctx) {
  const { builder } = ctx;

  if (el.params.length) {
    // Receive context tag.
    let fromValue = el.getAttributeValue("from");

    if (!fromValue) {
      return ctx.addError(
        "context 'from' attribute is required and should point to another component."
      );
    }

    if (fromValue.type === "Literal") {
      const literalValue = fromValue.value;
      if (literalValue === ".") {
        fromValue = buildModuleExports(builder);
      } else {
        const fromTag = ctx.taglibLookup.getTag(literalValue);

        if (fromTag) {
          fromValue = ctx.importTemplate(fromTag.template);
        } else {
          return ctx.addError(
            `context receiver could not find context provider matching 'from="${literalValue}"'.`
          );
        }
      }
    }

    const getNode = ctx.createNodeForEl("get-context");
    getNode.params = el.params;
    getNode.setAttributeValue("__from", fromValue);
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
