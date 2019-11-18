const assert = require("assert");
const counter = require("./fixtures/counter");

describe("browser", () => {
  describe("state", () => {
    it("works", async () => {
      const component = counter
        .renderSync()
        .appendTo(document.body)
        .getComponent();

      const count = component.getEl("count");
      const increment = component.getEl("increment");

      assert.equal(count.textContent, "The count is 0");

      increment.click();

      await onceMutated(count);

      assert.equal(count.textContent, "The count is 1");
    });
  });
});

function onceMutated(node) {
  return new Promise((resolve, reject) => {
    var observer = new MutationObserver(function(mutations) {
      resolve(mutations);
      observer.disconnect();
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  });
}

function onceMutated2(node) {
  const originalHTML = node.outerHTML;
  return new Promise((resolve, reject) => {
    const checkHTML = () => {
      const newHTML = node.outerHTML;
      if (originalHTML !== newHTML) {
        resolve();
      } else {
        window.requestAnimationFrame(checkHTML);
      }
    };
    window.requestAnimationFrame(checkHTML);
  });
}
