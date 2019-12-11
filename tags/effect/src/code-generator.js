module.exports = function(el, codegen) {
  const { context } = codegen;
  const { builder } = context;

  if (context.isServerTarget()) {
    return null;
  } else {
    // if this el is under an if/for/custom-tag
    // use the runtime implementation (effect.marko/mount.marko)

    // otherwise
    const key = "@123";
    const helper = context.importModule(
      "effect_tag",
      context.getRelativePath(require.resolve("./helper"))
    );
    const args = builder.parseJavaScriptArgs(el.argument);
    const deps = [];

    if (el.tagName === "effect") {
      deps.push(
        builder.functionCall(
          builder.memberExpression(
            builder.identifier("Math"),
            builder.identifier("random")
          ),
          []
        )
      );
    }

    return builder.functionCall(helper, [
      builder.identifier("component"),
      builder.literal(key),
      args[0],
      builder.arrayExpression(deps)
    ]);
  }
};
