const { getTagDef, isNativeTag } = require("@marko/babel-utils");
const { taglibId } = require("../../../marko.json");
const ensureLifecycle = require("../../util/ensure-lifecycle");
const depsVisitor = {
  ReferencedIdentifier(identifier, deps) {
    const { name } = identifier.node;
    const binding = identifier.scope.getBinding(name);
    if (binding) {
      if (binding.scope !== identifier.scope) {
        if (isCoreTag(binding.path, "const")) {
          // Const tag reflects the default value as dependencies.
          binding.path
            .get("attributes")
            .find(byAttrName("default"))
            .traverse(depsVisitor, deps);
        } else if (
          // Avoid including native tag refs as dependencies.
          !(
            isNativeTag(binding.path) ||
            (!binding.path.isMarkoTag() &&
              isCoreTag(
                binding.path.findParent((it) => it.isMarkoTag()),
                "_component"
              ))
          )
        ) {
          deps.add(binding.identifier.name);
        }
      }
    } else if (name === "input") {
      trackInputReference(identifier, "input", deps);
    }
  },
  Function(path) {
    path.skip();
  },
};

module.exports = function transform(tag, t) {
  const attrs = tag.get("attributes");
  const defaultAttr = attrs.find(byAttrName("default"));

  if (!defaultAttr) {
    throw tag
      .get("name")
      .buildCodeFrameError("<effect> requires being assigned a value.");
  }

  const handler = defaultAttr.get("value");
  if (!handler.isFunction()) {
    throw handler.buildCodeFrameError(
      "<effect=(() => {})> value must be an inline function."
    );
  }

  const deps = new Set();
  handler.traverse(depsVisitor, deps);

  if (deps.size) {
    tag.pushContainer(
      "attributes",
      t.markoAttribute(
        "_deps",
        t.arrayExpression(
          Array.from(deps, (it) => {
            let lastIndex = 0;
            let optional = false;
            let nextIndex;
            let cur;

            while ((nextIndex = it.indexOf(".", lastIndex)) !== -1) {
              const identifier = t.identifier(it.slice(lastIndex, nextIndex));

              if (cur) {
                if (optional) {
                  cur = t.optionalMemberExpression(
                    cur,
                    identifier,
                    false,
                    true
                  );
                } else {
                  cur = t.memberExpression(cur, identifier);
                  optional = true;
                }
              } else {
                cur = identifier;
              }

              lastIndex = nextIndex + 1;
            }

            if (cur) {
              const identifier = t.identifier(it.slice(lastIndex));

              return optional
                ? t.optionalMemberExpression(cur, identifier, false, true)
                : t.memberExpression(cur, identifier);
            }

            return t.identifier(it);
          })
        )
      )
    );
  }

  ensureLifecycle(tag);
};

function trackInputReference(identifier, accessor, accessors) {
  let curPath = identifier;
  let curAccessor = accessor;

  while (true) {
    const { parentPath } = curPath;

    if (
      parentPath.isMarkoAttribute() &&
      isCoreTag(parentPath.parentPath, "const")
    ) {
      trackInputAlias(parentPath.parentPath.get("var"), curAccessor, accessors);
      return;
    }

    if (parentPath.isMemberExpression()) {
      const property = parentPath.get("property");

      if (!parentPath.node.computed) {
        curAccessor += `.${property.node.name}`;
      } else if (property.isStringLiteral()) {
        curAccessor += `.${property.node.value}`;
      } else {
        // Bail when computed property used.
        break;
      }
    } else {
      break;
    }

    curPath = parentPath;
  }

  accessors.add(curAccessor);
}

function trackInputAlias(lVal, accessor, accessors) {
  if (lVal.isIdentifier()) {
    for (const ref of lVal.scope.getBinding(lVal.node.name).referencePaths) {
      trackInputReference(ref, accessor, accessors);
    }
  } else if (lVal.isArrayPattern()) {
    let i = 0;
    for (const element of lVal.get("elements")) {
      if (element.node) {
        if (element.isRestElement()) {
          trackInputAlias(element.get("argument"), accessor, accessors);
        } else {
          trackInputAlias(element, `${accessor}.${i}`, accessors);
        }
      }

      i++;
    }
  } else if (lVal.isObjectPattern()) {
    for (const property of lVal.get("properties")) {
      if (property.isRestElement()) {
        trackInputAlias(property.get("argument"), accessor, accessors);
      } else if (property.isObjectProperty()) {
        trackInputAlias(
          property.get("value"),
          `${accessor}.${property.get("key").node.name}`,
          accessors
        );
      }
    }
  }
}

function byAttrName(name) {
  return (attr) => attr.node.name === name;
}

function isCoreTag(tag, name) {
  if (tag.isMarkoTag()) {
    const def = getTagDef(tag);

    if (def && def.name === name && def.taglibId === taglibId) {
      return true;
    }
  }

  return false;
}
