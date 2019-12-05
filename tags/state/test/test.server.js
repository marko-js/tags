const { render } = require("@marko/testing-library");
const { expect } = require("chai");
const simple = require("./fixtures/simple.marko");
const multi = require("./fixtures/multi.marko");
const assignment = require("./fixtures/assignment.marko");
const bool = require("./fixtures/boolean.marko");
const noInit = require("./fixtures/noInitializer.marko");

describe("server", () => {
  it("renders as usual without state tag", async () => {
    const { container, getByText } = await render(simple, {
      value: "Custom state text"
    });

    expect(container)
      .has.property("children")
      .with.length(1);

    expect(getByText("Custom state text")).to.exist;
  });

  it("renders as multi state tags", async () => {
    const { container, getByText } = await render(multi, {
      value: "Custom state text"
    });

    expect(container)
      .has.property("children")
      .with.length(1);

    expect(getByText("Custom state text")).to.exist;
    expect(getByText("2")).to.exist;
  });
  it("renders as using complex functions", async () => {
    const { container, getByText } = await render(assignment);

    expect(container)
      .has.property("children")
      .with.length(1);

    expect(getByText("1")).to.exist;
  });
  it("renders as using boolean functions", async () => {
    const { container, getByText } = await render(bool);

    expect(container)
      .has.property("children")
      .with.length(1);

    expect(getByText("false")).to.exist;
  });
  it("errors when using old scriptlet", async () => {
    expect(() => {
      require("./fixtures/errorOldScriptlet.marko");
    }).to.throw(
      "Unsupported scriptlet found. Please change <% script %> to be $ script"
    );
  });
  it("Should render without an initialized variable", async () => {
    const { container, getByText } = await render(noInit);

    expect(container)
      .has.property("children")
      .with.length(1);

    expect(getByText("1").id).to.equal("1");
    expect(getByText("notInit").id).to.equal("2");
  });
});
