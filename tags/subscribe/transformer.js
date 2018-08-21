const onFormatDash = /^(on(?:ce)?)-(.+)/;
const onFormatCamel = /^(on(?:ce)?)([A-Z])(.*)/;

module.exports = function(el, ctx) {
  const { builder } = ctx;
  const events = [];

  el.forEachAttribute(attr => {
    if (attr.argument) {
      let match;
      let method;
      let eventName;

      if ((match = onFormatDash.exec(attr.name))) {
        method = match[1];
        eventName = match[2];
      } else if ((match = onFormatCamel.exec(attr.name))) {
        method = match[1];
        eventName = match[2].toLowerCase() + match[3];
      }

      if (eventName) {
        events.push(method, eventName);
      }
    }
  });

  el.setAttributeValue("__events", builder.literal(events));
};
