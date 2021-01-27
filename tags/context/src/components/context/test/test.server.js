const { render } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));

describe("server", () => {
  it("renders in the same component", async () => {
    const template = require("./fixtures/same-component").default;
    const { container } = await render(template, {
      data: "[provided content]",
    });
    expect(container).has.text("[receiver content][provided content]");
  });

  it("renders in two separate components", async () => {
    const template = require("./fixtures/external-components").default;
    const { container } = await render(template, {
      data: "[provided content]",
    });
    expect(container).has.text(
      "[example content] [receiver content][provided content]"
    );
  });

  it("renders in two separate components using from as a constructor", async () => {
    const template = require("./fixtures/external-components-from-as-constructor")
      .default;
    const { container } = await render(template, {
      data: "[provided content]",
    });
    expect(container).has.text(
      "[example content] [receiver content][provided content]"
    );
  });

  it("renders across distant components", async () => {
    const template = require("./fixtures/distant-components").default;
    const { container } = await render(template, {
      data: "[provided content]",
      show: true,
    });
    expect(container).has.text(
      "[example content] [receiver content][provided content]"
    );
  });

  it("renders with multiple context components", async () => {
    const template = require("./fixtures/multiple-context-components").default;
    const { container } = await render(template, {
      data: "[provided content]",
    });
    expect(container).has.text(
      "[example 1 content] [receiver 1 content][provided content] [seperator] [example 2 content] [receiver 2 content][provided content]"
    );
  });

  it("renders with spread attributes on context", async () => {
    const template = require("./fixtures/spread-context-data").default;
    const { container } = await render(template, { a: 1, b: 2 });
    expect(container).has.text('{"a":1,"b":2}');
  });

  it("renders with async tags", async () => {
    const template = require("./fixtures/async-component").default;
    const { container } = await render(template, {
      data: "[provided content]",
    });
    expect(container).has.text(
      "[receiver async][provided content][receiver nested][provider content nested]"
    );
  });
});
