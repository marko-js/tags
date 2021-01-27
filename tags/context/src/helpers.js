var CONTEXT_KEY = "__subtree_context__";
var HAS_BOUND_ASYNC_CONTEXT = "__bound_async_subtree_context__";
var typeIndex = 0;

exports.pushProvider = function (out, component) {
  if (!out[HAS_BOUND_ASYNC_CONTEXT]) {
    out[HAS_BOUND_ASYNC_CONTEXT] = true;
    out.on("beginAsync", bindSubtreeContextOnBeginAsync);
  }

  var prevContext = out[CONTEXT_KEY];
  var nextContext = (out[CONTEXT_KEY] = Object.create(prevContext || {}));
  var provider = component.input.__from;
  var providerId = provider.__providerId;

  if (!providerId) {
    providerId = provider.__providerId = ++typeIndex;
  }

  nextContext[providerId] = component;

  return function popProvider() {
    out[CONTEXT_KEY] = prevContext;
  };
};

exports.getProvider = function (out, provider) {
  return out[CONTEXT_KEY][provider.__providerId];
};

function bindSubtreeContextOnBeginAsync(event) {
  var parent = event.parentOut;
  var child = event.out;
  child[HAS_BOUND_ASYNC_CONTEXT] = true;
  child[CONTEXT_KEY] = parent[CONTEXT_KEY];
}
