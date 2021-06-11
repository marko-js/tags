const getClosestMeta = require("../_component/get-closest-meta");

module.exports = function translate(path, t) {
  const { file } = path.hub;
  const server = file.markoOpts.output === "html";
  const defaultAttr = path
    .get("attributes")
    .find((attr) => attr.node.name === "default");

  const tagVar = path.get("var");

  if (!tagVar.node) {
    throw path
      .get("name")
      .buildCodeFrameError("let requires a variable to be assigned to.");
  }

  if (server) {
    path.replaceWith(
      t.variableDeclaration("const", [
        t.variableDeclarator(
          tagVar.node,
          defaultAttr ? defaultAttr.node.value : t.nullLiteral()
        ),
      ])
    );
  } else {
    file.path.scope.crawl();

    const meta = getClosestMeta(path);
    const binding = path.scope.getBinding(tagVar.node.name);

    binding.constantViolations.forEach((path) => {
      path.replaceWith(
        t.callExpression(
          t.memberExpression(meta.component, t.identifier("setState")),
          [
            tagVar.node,
            t.isUpdateExpression(path.node)
              ? t.binaryExpression(
                  path.node.operator === "++" ? "+" : "-",
                  t.memberExpression(meta.state, tagVar.node, true),
                  t.numericLiteral(1)
                )
              : path.node.operator === "="
              ? path.node.right
              : t.binaryExpression(
                  path.node.operator.slice(0, -1),
                  t.memberExpression(meta.state, tagVar.node, true),
                  path.node.right
                ),
          ]
        )
      );
    });

    binding.referencePaths.forEach((path) => {
      if (!t.isUpdateExpression(path.node)) {
        path.replaceWith(t.memberExpression(meta.state, tagVar.node, true));
      }
    });

    const stateVar = t.variableDeclaration("var", [
      t.variableDeclarator(
        tagVar.node,
        t.stringLiteral("" + meta.extra.___stateIndex++)
      ),
    ]);

    if (!defaultAttr) {
      path.replaceWith(stateVar);
    } else {
      path.replaceWithMultiple([
        stateVar,
        t.expressionStatement(
          t.logicalExpression(
            "&&",
            t.unaryExpression(
              "!",
              t.binaryExpression("in", tagVar.node, meta.state)
            ),
            t.assignmentExpression(
              "=",
              t.memberExpression(meta.state, tagVar.node, true),
              defaultAttr.node.value
            )
          )
        ),
      ]);
    }
  }
};
