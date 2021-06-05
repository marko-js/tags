const sinon = require("sinon");
const { render, cleanup, fireEvent } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

const simpleValue = require("./fixtures/simple-value").default;
const destructure = require("./fixtures/destructuring").default;
const destructureComplex = require("./fixtures/destructure-complex").default;
const inputExpression = require("./fixtures/input-expression").default;

describe("browser", () => {
  afterEach(cleanup);

  it("declares variable with value", async () => {
    const { container } = await render(simpleValue, {});
    expect(container.firstElementChild).has.text("Hi John");
  });

  it("handles destructuring", async () => {
    const { container } = await render(destructure, {});
    expect(container.firstElementChild).has.text("apples oranges bananas");
  });

  it("handles destructuring assignment", async () => {
    const { container } = await render(destructureComplex, {});
    expect(container.firstElementChild).has.text("George R.R. Martin");
  });

  it("declares an expression based on input", async () => {
    const { container, rerender } = await render(inputExpression, { value: 3 });
    expect(container.firstElementChild).has.text("3 x 2 = 6");
    await rerender({ value: 9 });
    expect(container.firstElementChild).has.text("9 x 2 = 18");
  });
});
