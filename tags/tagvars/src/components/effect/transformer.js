module.exports = function (a, b) {
  (a.hub ? marko5Transform : marko4Transform)(a, b);
};

const stateCreated = new WeakSet();

function marko5Transform(path, t) {
  if (!stateCreated.has(path.hub.file)) {
    stateCreated.add(path.hub.file);
    path.insertBefore(
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
                  t.memberExpression(t.thisExpression(), t.identifier("state")),
                  t.objectExpression([])
                )
              ),
            ])
          ),
        ])
      )
    );
  }
}

function marko4Transform(el, ctx) {
  throw new Error("<let> tag is not currently supported in Marko 4.");
}
