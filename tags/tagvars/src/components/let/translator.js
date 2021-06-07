const {
  getKeyManager,
} = require("@marko/translator-default/dist/util/key-manager");
const { importNamed } = require("@marko/babel-utils");

const wrapped = new WeakSet();

module.exports = function (a, b) {
  (a.hub ? marko5Translate : marko4Translate)(a, b);
};

function marko5Translate(path, t) {
  path.hub.file.path.scope.crawl();
  const server = path.hub.file.markoOpts.output === "html";
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
      t.variableDeclaration("let", [
        t.variableDeclarator(
          tagVar.node,
          defaultAttr ? defaultAttr.node.value : t.nullLiteral()
        ),
      ])
    );
  } else {
    const beginRender = importNamed(
      path.hub.file,
      require.resolve("./helper.js"),
      "beginRender"
    );
    const endRender = importNamed(
      path.hub.file,
      require.resolve("./helper.js"),
      "endRender"
    );
    const initState = importNamed(
      path.hub.file,
      require.resolve("./helper.js"),
      "initState"
    );
    const setState = importNamed(
      path.hub.file,
      require.resolve("./helper.js"),
      "setState"
    );

    if (!wrapped.has(path.hub.file)) {
      wrapped.add(path.hub.file);
      path.hub.file._renderBlock.node.body.unshift(
        t.expressionStatement(
          t.callExpression(beginRender, [t.identifier("component")])
        )
      );
      path.hub.file._renderBlock.node.body.push(
        t.expressionStatement(
          t.callExpression(endRender, [
            t.identifier("component"),
            t.identifier("state"),
          ])
        )
      );
    }

    const binding = path.scope.getBinding(tagVar.node.name);
    binding.constantViolations.forEach((path) => {
      path.replaceWith(
        t.callExpression(
          t.memberExpression(
            t.identifier("component"),
            t.identifier("setState")
          ),
          [
            tagVar.node,
            t.isUpdateExpression(path.node)
              ? t.binaryExpression(
                  path.node.operator === "++" ? "+" : "-",
                  t.memberExpression(t.identifier("state"), tagVar.node, true),
                  t.numericLiteral(1)
                )
              : path.node.operator === "="
              ? path.node.right
              : t.binaryExpression(
                  path.node.operator.slice(0, -1),
                  t.memberExpression(t.identifier("state"), tagVar.node, true),
                  path.node.right
                ),
          ]
        )
      );
    });
    binding.referencePaths.forEach((path) => {
      if (!t.isUpdateExpression(path.node)) {
        path.replaceWith(
          t.memberExpression(t.identifier("state"), tagVar.node, true)
        );
      }
    });
    getKeyManager(path).resolveKey(path);
    const stateVar = t.variableDeclaration("const", [
      t.variableDeclarator(tagVar.node, path.get("key").node),
    ]);
    const init = t.expressionStatement(
      t.logicalExpression(
        "&&",
        t.callExpression(initState, [
          t.identifier("component"),
          t.identifier("state"),
          tagVar.node,
        ]),
        t.callExpression(setState, [
          defaultAttr
            ? defaultAttr.node.value
            : t.unaryExpression("void", t.numericLiteral(0)),
        ])
      )
    );
    path.replaceWithMultiple([stateVar, init]);
  }
}

function marko4Translate(el, ctx) {
  throw new Error("<let> tag is not currently supported in Marko 4.");
}
