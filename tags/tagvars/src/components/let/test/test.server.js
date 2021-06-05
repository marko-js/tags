const { render } = require("@marko/testing-library");
const { expect } = require("chai");
const simple = require("./fixtures/simple.marko").default;
const multi = require("./fixtures/multi.marko").default;
const assignment = require("./fixtures/assignment.marko").default;
const bool = require("./fixtures/boolean.marko").default;
const noInit = require("./fixtures/noInitializer.marko").default;
const forTemplate = require("./fixtures/for.marko").default;

describe("server", () => {
  it("renders as usual without state tag", async () => {
    const { container, queryByText } = await render(simple, {
      value: "Custom state text",
    });

    expect(container).has.property("children").with.length(1);

    expect(queryByText("Custom state text")).to.exist;
  });

  it("renders as multi state tags", async () => {
    const { container, queryByText } = await render(multi, {
      value: "Custom state text",
    });

    expect(container).has.property("children").with.length(1);

    expect(queryByText("Custom state text")).to.exist;
    expect(queryByText("2")).to.exist;
  });
  it("renders as using complex functions", async () => {
    const { container, queryByText } = await render(assignment);

    expect(container).has.property("children").with.length(1);

    expect(queryByText("1")).to.exist;
  });
  it("renders as using boolean functions", async () => {
    const { container, queryByText } = await render(bool);

    expect(container).has.property("children").with.length(1);

    expect(queryByText("false")).to.exist;
  });
  it("Should render without an initialized variable", async () => {
    const { container, getByText } = await render(noInit);

    expect(container).has.property("children").with.length(1);

    expect(getByText("1").id).to.equal("1");
    expect(getByText("notInit").id).to.equal("2");
  });
  it("Should render being nested in a for loop", async () => {
    const { container, getByText } = await render(forTemplate);

    expect(getByText("1").id).to.equal("1");
    expect(getByText("2").id).to.equal("2");
    expect(getByText("3").id).to.equal("3");
  });
});
