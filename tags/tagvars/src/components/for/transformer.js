const visited = new WeakSet();
module.exports = function transform(tag, t) {
  if (visited.has(tag)) {
    return;
  }

  visited.add(tag);
  const attrs = tag.get("attributes");
  const byAttr = attrs.find(byAttrName("by"));

  if (!byAttr) {
    return;
  }

  let byId;
  const idId = tag.get("body").scope.generateUidIdentifier("id");

  if (byAttr.get("value").isIdentifier()) {
    byId = byAttr.node.value;
  } else {
    byId = tag.parentPath.scope.generateUidIdentifier("by");
    tag.insertBefore(
      t.markoScriptlet([
        t.variableDeclaration("const", [
          t.variableDeclarator(byId, byAttr.node.value),
        ]),
      ])
    );
  }

  tag
    .get("body")
    .unshiftContainer(
      "body",
      t.markoScriptlet([
        t.variableDeclaration("const", [
          t.variableDeclarator(idId, t.callExpression(byId, getByArgs(tag))),
        ]),
      ])
    );

  tag.set("keyScope", idId);
  byAttr.remove();
};

function getByArgs(tag) {
  const body = tag.get("body");
  const params = body.node.params;
  const attrs = tag.get("attributes");

  if (attrs.find(byAttrName("in"))) {
    if (params.length < 1) {
      body.pushContainer("params", tag.scope.generateUidIdentifier("key"));
    }

    if (params.length < 2) {
      body.pushContainer("params", tag.scope.generateUidIdentifier("val"));
    }
  } else if (attrs.find(byAttrName("of"))) {
    if (params.length < 1) {
      body.pushContainer("params", tag.scope.generateUidIdentifier("val"));
    }

    if (params.length < 2) {
      body.pushContainer("params", tag.scope.generateUidIdentifier("key"));
    }
  } else {
    if (params.length < 1) {
      body.pushContainer("params", tag.scope.generateUidIdentifier("index"));
    }
  }

  return params;
}

function byAttrName(name) {
  return (attr) => attr.node.name === name;
}
