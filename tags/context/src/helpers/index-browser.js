var PENDING_NOTIFY;
var ACTIVE_SUBSCRIBERS = [];
var PROVIDER_LOOKUP = emptyObj();
function noop() {}

exports.pushProvider = function(_, component) {
  var name = component.name;
  var providers = PROVIDER_LOOKUP[name] || (PROVIDER_LOOKUP[name] = emptyObj());
  var isNewProvider = !providers[component.id];

  if (isNewProvider) {
    queueNotify();
    providers[component.id] = component;
    component.once("destroy", removeProvider);
  }

  return noop;
};

exports.getProvider = function(_, name, component) {
  var subscriberId = component.id;
  var provider = getClosestProvider(subscriberId, name);

  if (!provider) {
    throw new Error('Unable to find context provider for "' + name + '"');
  }

  var isNewSubscriber = ACTIVE_SUBSCRIBERS.indexOf(component) === -1;

  if (isNewSubscriber) {
    ACTIVE_SUBSCRIBERS.push(component);
    component.once("destroy", removeSubscriber);
  }

  return provider;
};

function getClosestProvider(subscriberId, name) {
  var providers = PROVIDER_LOOKUP[name];
  var maxSpecificity = -1;
  var provider;

  if (providers) {
    var providerIds = Object.keys(providers);

    for (var i = providerIds.length; i--; ) {
      var providerId = providerIds[i];
      var curSpecificity = getSpecificity(subscriberId, providerId);

      if (curSpecificity > maxSpecificity) {
        maxSpecificity = curSpecificity;
        provider = providers[providerId];
      }
    }
  }

  return provider;
}

function getSpecificity(subscriberId, providerId) {
  if (subscriberId.indexOf(providerId + "-") !== 0) {
    return -1;
  }

  var specificity = 0;
  var index = 0;

  while ((index = providerId.indexOf("-", index + 1)) !== -1) {
    specificity++;
  }

  return specificity;
}

function queueNotify() {
  PENDING_NOTIFY =
    PENDING_NOTIFY ||
    setTimeout(function() {
      PENDING_NOTIFY = undefined;

      for (var i = ACTIVE_SUBSCRIBERS.length; i--; ) {
        var subscriber = ACTIVE_SUBSCRIBERS[i];
        var activeProvider = subscriber.provider;
        subscriber.setProvider(
          getClosestProvider(subscriber.id, activeProvider.name)
        );
      }
    }, 0);
}

function removeProvider() {
  queueNotify();
  delete PROVIDER_LOOKUP[this.name][this.id];
}

function removeSubscriber() {
  ACTIVE_SUBSCRIBERS.splice(ACTIVE_SUBSCRIBERS.indexOf(this), 1);
}

function emptyObj() {
  return Object.create(null);
}
