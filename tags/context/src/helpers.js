var CONTEXT_KEY = "__subtree_context__";
var HAS_BOUND_ASYNC_CONTEXT = "__bound_async_subtree_context__";

exports.pushProvider = function(out, name, component, data) {
  var outGlobal = out.global;

  if (!outGlobal[HAS_BOUND_ASYNC_CONTEXT]) {
    outGlobal[HAS_BOUND_ASYNC_CONTEXT] = true;
    out.on("beginAsync", bindSubtreeContextOnBeginAsync);
  }

  var prevContext = outGlobal[CONTEXT_KEY];
  var nextContext = (outGlobal[CONTEXT_KEY] = Object.create(prevContext || {}));
  nextContext[name] = {
    data: data,
    component: component
  };

  return function popProvider() {
    outGlobal[CONTEXT_KEY] = prevContext;
  };
};

exports.getProvider = function(out, name) {
  return out.global[CONTEXT_KEY][name];
};

function bindSubtreeContextOnBeginAsync(event) {
  var parent = event.parentOut;
  var child = event.out;
  child[CONTEXT_KEY] = parent[CONTEXT_KEY];
}
