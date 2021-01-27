const { render } = require("@marko/testing-library");
const { expect } = require("chai");
const template = require("../").default;

describe("server", () => {
  it("does not render anything", async () => {
    const { container } = await render(template, {
      renderBody(out) {
        out.write("content");
      },
    });

    expect(container).has.property("children").with.length(0);
  });
});
