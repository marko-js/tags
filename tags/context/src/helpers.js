var CONTEXT_KEY = "__subtree_context__";
var HAS_BOUND_ASYNC_CONTEXT = "__bound_async_subtree_context__";

let topLevelComponentsChannels = false;
if (typeof window !== 'undefined') {
  topLevelComponentsChannels = {};
}

exports.pushProvider = function(out, component, topLevelStackChannel) {
  if (!out[HAS_BOUND_ASYNC_CONTEXT]) {
    out[HAS_BOUND_ASYNC_CONTEXT] = true;
    out.on("beginAsync", bindSubtreeContextOnBeginAsync);
  }

  var prevContext = out[CONTEXT_KEY];
  var nextContext = (out[CONTEXT_KEY] = Object.create(prevContext || {}));
  nextContext[component.name] = component;

  if (topLevelStackChannel && topLevelComponentsChannels) {
    topLevelComponentsChannels[topLevelStackChannel] = nextContext;
  }

  return function popProvider() {
    out[CONTEXT_KEY] = prevContext;
  };
};

exports.getProvider = function(out, name, topLevelStackChannel) {
  if (out[CONTEXT_KEY] && out[CONTEXT_KEY][name]) return out[CONTEXT_KEY][name];
  if (!topLevelStackChannel || !topLevelComponentsChannels) return undefined;
  return topLevelComponentsChannels[topLevelStackChannel];
};

function bindSubtreeContextOnBeginAsync(event) {
  var parent = event.parentOut;
  var child = event.out;
  child[HAS_BOUND_ASYNC_CONTEXT] = true;
  child[CONTEXT_KEY] = parent[CONTEXT_KEY];
}
