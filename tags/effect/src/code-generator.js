const esprima = require("esprima");
const estraverse = require("estraverse");

function findDepsInAst(ast) {
  const dependencies = [];
  const callStack = [];

  estraverse.traverse(ast, {
    enter: node => {
      let top = callStack[callStack.length - 1];
      if (node.type === "MemberExpression") {
        callStack.push({
          identifier: [],
          members: []
        });
      } else if (node.type === "Identifier" && !!top) {
        top.identifier.push(node.name);
      }
    },
    leave: node => {
      if (node.type === "MemberExpression") {
        const top = callStack.pop();
        top.members.push(top.identifier.map(i => i));
        dependencies.push(top);
      }
    }
  });
  return dependencies;
}

function findDeps(el, context) {
  const builder = context.builder;
  let dependencies = [];
  const foundDepdencies = {};

  const walker = context.createWalker({
    enter(node) {
      if (node.argument) {
        const ast = esprima.parseScript(node.argument);
        const astDependencies = findDepsInAst(ast);
        astDependencies.forEach(deps => {
          deps.members.forEach(mem => {
            if (mem.length > 1 && !foundDepdencies[mem.join(".")]) {
              foundDepdencies[mem.join(".")] = true;
              const lastIdentifier = builder.identifier(mem.pop());
              dependencies.push(
                builder.memberExpression(
                  builder.identifier(mem.join(".")),
                  lastIdentifier
                )
              );
            }
          });
        });
      }
    }
  });

  walker.walk(el);
  return dependencies;
}

module.exports = function(el, codegen) {
  const { context } = codegen;
  const { builder } = context;

  if (context.isServerTarget()) {
    return null;
  } else {
    // if this el is under an if/for/custom-tag
    // use the runtime implementation (effect.marko/mount.marko)

    // otherwise
    const key = context.nextUniqueId();
    const helper = context.importModule(
      "effect_tag",
      context.getRelativePath(require.resolve("./helper"))
    );
    const args = builder.parseJavaScriptArgs(el.argument);
    let deps = [];

    if (el.tagName === "effect") {
      deps = findDeps(el, context);
    }

    return builder.functionCall(helper, [
      builder.identifier("component"),
      builder.literal(key),
      args[0],
      builder.arrayExpression(deps)
    ]);
  }
};
