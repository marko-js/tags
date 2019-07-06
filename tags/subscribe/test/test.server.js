const assert = require("assert");
const { render } = require("@marko/testing-library");
const template = require("../");

describe("server", () => {
  it("does not render anything", async () => {
    const { container } = await render(template, {
      renderBody(out) {
        out.write("content");
      }
    });

    assert.equal(container.children.length, 0);
  });
});
