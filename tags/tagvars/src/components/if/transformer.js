const seen = new WeakSet();
module.exports = function transform(tag, t) {
  if (seen.has(tag.node)) {
    return;
  }

  seen.add(tag.node);
  const arguments = tag.get("arguments");

  if (arguments.length) {
    throw arguments[0].buildCodeFrameError(
      "<if(condition)> is not supported with the tag api, use <if=condition> instead."
    );
  }

  const attrs = tag.get("attributes");
  const defaultAttr = attrs.find(byAttrName("default"));

  if (!defaultAttr) {
    throw tag
      .get("name")
      .buildCodeFrameError("<if> tag condition is required.");
  }

  if (attrs.length > 1) {
    throw tag
      .get("name")
      .buildCodeFrameError(
        "<if> tag only supports the default condition attribute."
      );
  }

  tag.set("arguments", [defaultAttr.node.value]);
  tag.set("attributes", []);
};

function byAttrName(name) {
  return (attr) => attr.node.name === name;
}
