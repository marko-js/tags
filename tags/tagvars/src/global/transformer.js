const nativeEventHandlers = require("./transformers/native-event-handlers");
const tagVar = require("./transformers/tag-var");

module.exports = (tag, t) => {
  if (!tag.hub) {
    throw new Error("The `Tags API` preview is only supported in Marko 5");
  }

  nativeEventHandlers(tag, t);
  tagVar(tag, t);
};
