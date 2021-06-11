module.exports = (path, t) => {
  path.replaceWith(
    t.variableDeclaration("var", [
      t.variableDeclarator(
        t.identifier("componentDef"),
        path.hub.file._componentDefIdentifier
      ),
    ])
  );
};
