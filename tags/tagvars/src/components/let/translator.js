const getClosestMeta = require("../../util/get-closest-meta");
const deepFreeze = require("../../util/deep-freeze/transform");

module.exports = function translate(tag, t) {
  const { file } = tag.hub;
  const server = file.markoOpts.output === "html";
  const tagVar = tag.node.var;
  const defaultAttr = tag.node.attributes.find((it) => it.name === "default");

  if (!tagVar) {
    throw tag
      .get("name")
      .buildCodeFrameError("<let> requires a variable to be assigned to.");
  }

  if (!defaultAttr) {
    throw tag
      .get("name")
      .buildCodeFrameError("<let> must be initialized with a value.");
  }

  if (server) {
    tag.replaceWith(
      t.variableDeclaration("const", [
        t.variableDeclarator(tagVar, deepFreeze(file, defaultAttr.value)),
      ])
    );
  } else {
    file.path.scope.crawl();

    const meta = getClosestMeta(tag);
    const binding = tag.scope.getBinding(tagVar.name);

    binding.constantViolations.forEach((assignment) => {
      assignment.replaceWith(
        t.callExpression(
          t.memberExpression(meta.component, t.identifier("setState")),
          [
            tagVar,
            t.isUpdateExpression(assignment.node)
              ? t.binaryExpression(
                  assignment.node.operator === "++" ? "+" : "-",
                  t.memberExpression(meta.state, tagVar, true),
                  t.numericLiteral(1)
                )
              : assignment.node.operator === "="
              ? deepFreeze(file, assignment.node.right)
              : t.binaryExpression(
                  assignment.node.operator.slice(0, -1),
                  t.memberExpression(meta.state, tagVar, true),
                  deepFreeze(file, assignment.node.right)
                ),
          ]
        )
      );
    });

    binding.referencePaths.forEach((ref) => {
      if (!t.isUpdateExpression(ref.node)) {
        ref.replaceWith(t.memberExpression(meta.state, tagVar, true));
      }
    });

    const stateVar = t.variableDeclaration("var", [
      t.variableDeclarator(
        tagVar,
        t.stringLiteral("" + meta.extra.___stateIndex++)
      ),
    ]);

    if (!defaultAttr) {
      tag.replaceWith(stateVar);
    } else {
      tag.replaceWithMultiple([
        stateVar,
        t.expressionStatement(
          t.logicalExpression(
            "&&",
            t.unaryExpression(
              "!",
              t.binaryExpression("in", tagVar, meta.state)
            ),
            t.assignmentExpression(
              "=",
              t.memberExpression(meta.state, tagVar, true),
              deepFreeze(file, defaultAttr.value)
            )
          )
        ),
      ]);
    }
  }
};
