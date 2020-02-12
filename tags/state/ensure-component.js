module.exports = function(el, context) {
  if (!context.___ADDED_CLASS_FOR_STATE_TAG) {
    const classEl = context.createNodeForEl("class");
    classEl.tagString = "class {}";
    context.___ADDED_CLASS_FOR_STATE_TAG = true;
    context.root.prependChild(classEl);
  }
  return el;
};
