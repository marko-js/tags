module.exports = function(component, key, fn, deps) {
  patchLifecycle(component);

  var lookup = (component.___effects = component.___effects || {});
  var previous = lookup[key];

  if (previous) {
    var different = false;
    for (var i = 0; i < deps.length; i++) {
      if (deps[i] !== previous.deps[i]) {
        different = true;
        break;
      }
    }
    if (!different) {
      return;
    } else if (previous.cleanup) {
      previous.cleanup();
    }
  }

  lookup[key] = {
    fn: fn,
    deps: deps
  };
};

function patchLifecycle(component) {
  var proto = Object.getPrototypeOf(component);
  if (!proto.___hasEffects) {
    proto.___hasEffects = true;
    var originalMount = proto.onMount;
    var originalUpdate = proto.onUpdate;
    var originalDestroy = proto.onDestroy;
    proto.onMount = function() {
      originalMount && originalMount.apply(this, arguments);
      runEffect.call(this);
    };
    proto.onUpdate = function() {
      originalUpdate && originalUpdate.apply(this, arguments);
      runEffect.call(this);
    };
    proto.onDestroy = function() {
      originalDestroy && originalDestroy.apply(this, arguments);
      runCleanup.call(this);
    };
  }
}

function runEffect() {
  var effects = this.___effects;
  var keys = Object.keys(effects);
  for (var i = 0; i < keys.length; i++) {
    var effect = effects[keys[i]];
    if (effect.fn) {
      effect.cleanup = effect.fn();
      delete effect.fn;
    }
  }
}

function runCleanup() {
  var effects = this.___effects;
  var keys = Object.keys(effects);
  for (var i = 0; i < keys.length; i++) {
    var cleanup = effects[keys[i]].cleanup;
    if (cleanup) {
      cleanup();
    }
  }
}
