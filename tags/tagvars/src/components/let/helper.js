// $ beginRender(component);
// $ initState(component, "some-unique-key") && setState(value);
// $ endRender(component);

let curKey;
let curState;

module.exports = {
  beginRender(component) {
    component.___prevStates = component.___states;
    component.___states = new Set();
  },
  endRender(component, state) {
    if (component.___prevStates) {
      for (const key of component.___prevStates) {
        if (!component.___states.has(key)) {
          delete state[key];
        }
      }
    }
    curKey = curState = undefined;
  },
  initState(component, state, key) {
    component.___states.add(key);
    if (!(key in state)) {
      curKey = key;
      curState = state;
      return true;
    }
  },
  setState(v) {
    curState[curKey] = v;
  },
};
