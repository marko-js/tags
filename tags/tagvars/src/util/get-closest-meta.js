const { types: t } = require("@marko/compiler");
module.exports = function getClosestMeta(tag) {
  let root = tag.parentPath;

  do {
    if (root.isProgram()) {
      return {
        component: t.identifier("component"),
        state: t.identifier("state"),
        extra: getExtra(root),
      };
    }

    if (root.isMarkoTag() && root.node.name.value === "_component") {
      const [componentDef, component, state] = root.node.body.params;
      return {
        componentDef,
        component,
        state,
        extra: getExtra(root),
      };
    }
  } while ((root = root.parentPath));
};

function getExtra(path) {
  const extra = path.node.extra || (path.node.extra = {});

  if (extra.___refIndex === undefined) {
    extra.___refIndex = extra.___stateIndex = 0;
  }

  return extra;
}
