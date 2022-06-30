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
        if (!this.isConnected) this._whenDetached();
      }
    }
  );
}

module.exports = {
  onMount() {
    this.el.parentNode._whenDetached = () => this.destroy();
  },
};
