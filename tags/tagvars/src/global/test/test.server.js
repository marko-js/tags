const { render } = require("@marko/testing-library");
const { expect } = require("chai");
const simple = require("./fixtures/simple.marko").default;

describe("server", () => {
  it("renders as usual without state tag", async () => {
    const { container, queryByText } = await render(simple);

    expect(container).has.property("children").with.length(1);

    expect(queryByText("Custom state text")).to.exist;
  });
});
