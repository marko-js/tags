var CONTEXT_KEY = "__subtree_context__";
var HAS_BOUND_ASYNC_CONTEXT = "__bound_async_subtree_context__";

exports.pushProvider = function(out, name, component, data) {
  if (!out[HAS_BOUND_ASYNC_CONTEXT]) {
    out[HAS_BOUND_ASYNC_CONTEXT] = true;
    out.on("beginAsync", bindSubtreeContextOnBeginAsync);
  }

  var prevContext = out[CONTEXT_KEY];
  var nextContext = (out[CONTEXT_KEY] = Object.create(prevContext || {}));
  nextContext[name] = {
    data: data,
    component: component
  };

  return function popProvider() {
    out[CONTEXT_KEY] = prevContext;
  };
};

exports.getProvider = function(out, name) {
  return out[CONTEXT_KEY][name];
};

function bindSubtreeContextOnBeginAsync(event) {
  var parent = event.parentOut;
  var child = event.out;
  child[HAS_BOUND_ASYNC_CONTEXT] = true;
  child[CONTEXT_KEY] = parent[CONTEXT_KEY];
}
