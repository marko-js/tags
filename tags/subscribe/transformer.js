const onFormatDash = /^(on(?:ce)?)-(.+)/;
const onFormatCamel = /^(on(?:ce)?)([A-Z])(.*)/;

module.exports = function (a, b) {
  (a.hub ? marko5Transform : marko4Transform)(a, b);
};

function marko5Transform(path, t) {
  const eventsArray = t.arrayExpression([]);
  path.get("attributes").forEach((attr) => {
    if (attr.get("arguments").length) {
      const { type, event } = getTypeAndEvent(attr.get("name").node);
      if (type) {
        eventsArray.elements.push(
          t.stringLiteral(type),
          t.stringLiteral(event)
        );
      }
    } else if (attr.node.name === "to") {
      attr.set(
        "value",
        t.logicalExpression(
          "&&",
          t.binaryExpression(
            "===",
            t.unaryExpression("typeof", t.identifier("window")),
            t.stringLiteral("object")
          ),
          attr.node.value
        )
      );
    }
  });

  path.pushContainer("attributes", t.markoAttribute("__events", eventsArray));
}

function marko4Transform(el, ctx) {
  const { builder } = ctx;
  const events = [];

  if (ctx.isServerTarget()) {
    el.removeAllAttributes();
  } else {
    el.forEachAttribute((attr) => {
      if (attr.argument) {
        const { type, event } = getTypeAndEvent(attr.name);
        if (type) {
          events.push(type, event);
        }
      }
    });

    el.setAttributeValue("__events", builder.literal(events));
  }
}

function getTypeAndEvent(attrName) {
  let match;
  let type;
  let event;

  if ((match = onFormatDash.exec(attrName))) {
    type = match[1];
    event = match[2];
  } else if ((match = onFormatCamel.exec(attrName))) {
    type = match[1];
    event = match[2].toLowerCase() + match[3];
  }

  return {
    type,
    event,
  };
}
