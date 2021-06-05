const assert = require("assert");
const sinon = require("sinon");
const { render } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));

const simpleValue = require("./fixtures/simple-value").default;
const destructure = require("./fixtures/destructuring").default;
const destructureComplex = require("./fixtures/destructure-complex").default;
const inputExpression = require("./fixtures/input-expression").default;

describe("server", () => {
  it("declares and inserts simple value", async () => {
    const { container } = await render(simpleValue, {});
    expect(container).has.text("Hi John");
  });

  it("handles destructuring", async () => {
    const { container } = await render(destructure, {});
    expect(container).has.text("apples oranges bananas");
  });

  it("handles destructuring assignment", async () => {
    const { container } = await render(destructureComplex, {});
    expect(container).has.text("George R.R. Martin");
  });

  it("declares an expression based on input", async () => {
    const { container } = await render(inputExpression, { value: 3 });
    expect(container).has.text("3 x 2 = 6");
  });
});
