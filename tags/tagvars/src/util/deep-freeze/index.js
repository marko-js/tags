module.exports = function deepFreeze(val) {
  if (!Object.isFrozen(val)) {
    Object.freeze(val);
    for (const key in val) {
      deepFreeze(val[key]);
    }
  }

  return val;
};
