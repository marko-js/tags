module.exports = (path, t) => {
  const {
    node,
    hub: { file },
  } = path;
  path
    .get("body")
    .unshiftContainer(
      "body",
      t.variableDeclaration("var", [
        t.variableDeclarator(file._componentDefIdentifier, node.body.params[0]),
        t.variableDeclarator(
          file._componentInstanceIdentifier,
          node.body.params[1]
        ),
      ])
    );
};
