const { expect, use } = require("chai");
const { render, screen } = require("@marko/testing-library");
const Basic = require("./fixtures/basic.marko").default;

use(require("chai-dom"));

describe("browser", () => {
  it("basic", async () => {
    const { rerender } = await render(Basic, { show: false });
    expect(screen.queryByText("Hello world!")).not.to.exist;

    await rerender({ show: true });
    expect(screen.getByText("Hello world!")).to.exist;

    await rerender({ show: false });
    expect(screen.queryByText("Hello world!")).not.to.exist;
  });
});
