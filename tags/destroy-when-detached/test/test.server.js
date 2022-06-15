const { render } = require("@marko/testing-library");
const { expect } = require("chai");
const template = require("../").default;

describe("server", () => {
  it("renders the custom element wrapper", async () => {
    const { container } = await render(template, {
      renderBody(out) {
        out.write("content");
      },
    });

    expect(container).has.property("children").with.length(1);
    expect(container.textContent).has.equals("content");
    expect(container.firstElementChild.tagName.toLowerCase()).equals(
      "marko-destroy-when-detached"
    );
  });
});
