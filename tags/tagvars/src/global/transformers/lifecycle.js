const { types: t } = require("@marko/compiler");
const { isNativeTag, getTagDef } = require("@marko/babel-utils");
const { taglibId } = require("../../../marko.json");
const lifecycleRootsForProgram = new WeakMap();
const tagsNeedingLifecycle = new Set(["id", "let", "effect"]);

exports.closest = function (tag) {
  let root = tag;
  let node;
  while ((root = root.parentPath) && (node = root.node)) {
    const extra = node.extra;
    if (extra) {
      const meta = extra.___lifecycle;
      if (meta) {
        return meta;
      }
    }
  }
};

exports.visitor = {
  Program: {
    enter(program) {
      lifecycleRootsForProgram.set(program, new Set());
    },
    exit(program) {
      for (const root of lifecycleRootsForProgram.get(program)) {
        if (root === program) {
          program.node.body = buildRootLifecycle(program).concat(
            program.node.body
          );
        } else {
          root.node.body.body = [buildNestedLifecycle(root)];
        }
      }
    },
  },
  MarkoTag(tag) {
    if (isNativeTag(tag)) {
      if (tag.node.var) {
        ensureLifecycle(tag);
      }
    } else {
      const tagDef = getTagDef(tag);

      if (
        tagDef &&
        tagDef.taglibId === taglibId &&
        tagsNeedingLifecycle.has(tagDef.name)
      ) {
        ensureLifecycle(tag);
      }
    }
  },
};

function ensureLifecycle(tag) {
  const program = tag.hub.file.path;
  let root = tag;
  while (
    (root = root.parentPath) !== program &&
    (root = root.parentPath).node &&
    isNativeTag(root)
  );

  if (root.node) {
    const roots = lifecycleRootsForProgram.get(program);

    if (!roots.has(root)) {
      const extra = root.node.extra;
      const meta = {
        component: root.scope.generateUidIdentifier("component"),
        state: root.scope.generateUidIdentifier("state"),
        stateIndex: 0,
        refIndex: 0,
      };

      roots.add(root);

      if (extra) {
        extra.___lifecycle = meta;
      } else {
        root.node.extra = { ___lifecycle: meta };
      }
    }
  }
}

function buildRootLifecycle(program) {
  const meta = program.node.extra.___lifecycle;
  return [
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
    ),
    t.markoScriptlet([
      t.variableDeclaration("var", [
        t.variableDeclarator(meta.component, t.identifier("component")),
        t.variableDeclarator(meta.state, t.identifier("state")),
      ]),
    ]),
  ];
}

function buildNestedLifecycle(tag) {
  const meta = tag.node.extra.___lifecycle;
  return t.markoTag(
    t.stringLiteral("_component"),
    [],
    t.markoTagBody(tag.node.body.body, [
      tag.scope.generateUidIdentifier("nestedComponentDef"),
      meta.component,
      meta.state,
    ])
  );
}
