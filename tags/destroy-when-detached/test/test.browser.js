const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

const exampleSingleChild = require("./fixtures/example-single-child").default;
const exampleMultipleChildren = require("./fixtures/example-multiple-children")
  .default;
const exampleNestedChildren = require("./fixtures/example-nested-children")
  .default;

describe("browser", () => {
  afterEach(cleanup);
  beforeEach(() => {
    window.destroyedComponents = 0;
  });

  it("destroys a single child when manually removed", async () => {
    const { container } = await render(exampleSingleChild);
    expect(window.destroyedComponents).to.equal(0);
    container.remove();
    expect(window.destroyedComponents).to.equal(1);
  });

  it("destroys multiple children when manually removed", async () => {
    const { container } = await render(exampleMultipleChildren);
    expect(window.destroyedComponents).to.equal(0);
    container.remove();
    expect(window.destroyedComponents).to.equal(2);
  });

  it("destroys nested children when manually removed", async () => {
    const { container } = await render(exampleNestedChildren);
    expect(window.destroyedComponents).to.equal(0);
    container.remove();
    expect(window.destroyedComponents).to.equal(3);
  });
});
