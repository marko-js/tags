const {
  getKeyManager,
} = require("@marko/translator-default/dist/util/key-manager");
const { importDefault } = require("@marko/babel-utils");
const depsVisitor = {
  MemberExpression(path, deps) {
    const name = path.node.object.name;
    if (name === "input" || name === "state") {
      deps.push(path.node);
    }
  },
  Function(path) {
    path.skip();
  },
};

module.exports = function (a, b) {
  (a.hub ? marko5Translate : marko4Translate)(a, b);
};

function marko5Translate(path, t) {
  const isServer = path.hub.file.markoOpts.output === "html";
  if (isServer) {
    path.remove();
    return;
  }
  const defaultAttr = path
    .get("attributes")
    .find((attr) => attr.node.name === "default");

  if (!defaultAttr) {
    throw path
      .get("name")
      .buildCodeFrameError("effect requires being assigned a value.");
  }
  const helper = importDefault(
    path.hub.file,
    require.resolve("./helper.js"),
    "effect_wrap"
  );

  const deps = [];
  defaultAttr.get("value").traverse(depsVisitor, deps);
  getKeyManager(path).resolveKey(path);
  path.replaceWith(
    t.callExpression(helper, [
      t.identifier("component"),
      path.get("key").node,
      defaultAttr.node.value,
      t.arrayExpression(deps),
    ])
  );
}

function marko4Translate(el, ctx) {
  throw new Error("<effect> tag is not currently supported in Marko 4.");
}
