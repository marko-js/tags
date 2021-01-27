const path = require("path");

module.exports = function transform(a, b) {
  (a.hub ? transformMarko5 : transformMarko4)(a, b);
};

/**
 * @param tag {typeof import("@marko/babel-types").NodePath}
 * @param t {typeof import("@marko/babel-types").types}
 */
function transformMarko5(tag, t) {
  const file = tag.hub.file;
  const utils = require("@marko/babel-utils");

  if (tag.get("body").get("params").length) {
    // Receive context tag.
    const attrs = tag.get("attributes");
    const fromAttr = attrs.find((attr) => attr.node.name === "from");

    if (!fromAttr) {
      throw tag
        .get("name")
        .buildCodeFrameError(
          "context 'from' attribute is required and should point to another component."
        );
    }

    let fromValue = fromAttr.node.value;

    if (t.isStringLiteral(fromValue)) {
      const literalValue = fromValue.value;
      if (literalValue === ".") {
        fromValue = utils.importDefault(
          file,
          `./${path.basename(file.opts.sourceFileName)}`,
          "context"
        );
      } else {
        const fromTag = utils.getTagDefForTagName(file, literalValue);

        if (fromTag) {
          fromValue = utils.importDefault(file, `<${literalValue}>`, "context");
        } else {
          throw fromAttr.buildCodeFrameError(
            `context receiver could not find context provider matching "${literalValue}".`
          );
        }
      }
    }

    tag.replaceWith(
      t.markoTag(
        t.stringLiteral("get-context"),
        [t.markoAttribute("__from", fromValue)],
        tag.node.body
      )
    );
  } else {
    // Set context tag.
    tag.replaceWith(
      t.markoTag(
        t.stringLiteral("set-context"),
        tag.node.attributes.concat(
          t.markoAttribute(
            "__from",
            utils.importDefault(
              file,
              `./${path.basename(file.opts.sourceFileName)}`,
              "context"
            )
          )
        ),
        tag.node.body
      )
    );
  }

  // TODO: module.exports likely the issue.
}

function transformMarko4(el, ctx) {
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
}

function buildModuleExports(builder) {
  return builder.memberExpression(
    builder.identifier("module"),
    builder.identifier("exports")
  );
}
