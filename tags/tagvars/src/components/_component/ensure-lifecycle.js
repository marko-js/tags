const { types: t } = require("@marko/compiler");
const { isNativeTag } = require("@marko/babel-utils");
const addedRootComponent = new WeakSet();

module.exports = function ensureLifecycle(tag) {
  const program = tag.hub.file.path;
  let root = tag;
  while (
    (root = root.parentPath) !== program &&
    isNativeTag((root = root.parentPath))
  );

  if (root === program) {
    if (!addedRootComponent.has(tag.hub)) {
      addedRootComponent.add(tag.hub);
      program.unshiftContainer(
        "body",
        t.markoClass(
          t.classBody([
            t.classMethod(
              "method",
              t.identifier("onCreate"),
              [],
              t.blockStatement([
                t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier("state")
                    ),
                    t.objectExpression([])
                  )
                ),
              ])
            ),
          ])
        )
      );
    }
  } else if (root.node.name.value !== "_component") {
    const bodyPath = root.get("body");
    const newBody = [];

    for (const child of bodyPath.get("body")) {
      newBody.push(child.node);
      child.remove();
    }

    const componentTag = t.markoTag(
      t.stringLiteral("_component"),
      [],
      t.markoTagBody(newBody, [
        root.scope.generateUidIdentifier("nestedComponentDef"),
        root.scope.generateUidIdentifier("nestedComponent"),
        root.scope.generateUidIdentifier("nestedState"),
      ])
    );

    bodyPath.pushContainer("body", componentTag);
  }
};
