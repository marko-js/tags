const Empty = require("./empty.marko");
const name = "marko-destroy-when-detached";
if (!customElements.get(name)) {
  // We use a custom element so that we can reliably track when this container is removed from the DOM.
  // Since the "marko-destroy-when-detached" can already be registered from another Marko runtime, we
  // conditionally add the custom element.
  // We also defer to a `_whenDetached` property on the element which will allow different runtimes to implement
  // their own cleanup logic.
  customElements.define(
    name,
    class extends HTMLElement {
      disconnectedCallback() {
        this._whenDetached();
      }
    }
  );
}

/**
 * To force Marko to run through it's cleanup lifecycle
 * we replace the existing content with an empty Marko template.
 * Internally this will cause all existing elements being replaced to be destroyed.
 *
 * Finally we destroy the empty template we created as well to leave no nodes in the dom.
 */
function destroy() {
  (Empty.default || Empty).renderSync().replace(this).getComponent().destroy();
}

module.exports = {
  onMount() {
    this.el._whenDetached = destroy;
  },
};
