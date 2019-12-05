const sinon = require("sinon");
const { render, cleanup, fireEvent } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

const EventEmitter = require("events").EventEmitter;
const simpleState = require("./fixtures/simple");
const assignmentState = require("./fixtures/assignment");
const booleanState = require("./fixtures/boolean");
const multiState = require("./fixtures/multi");
const largeFunction = require("./fixtures/largeFunction");
const noInit = require("./fixtures/noInitializer");

describe("browser", () => {
  afterEach(cleanup);

  describe("State update", () => {
    it("Updates simple state", async () => {
      const { rerender, getByText } = await render(simpleState, {
        value: 1
      });
      const button = getByText("Increment");

      fireEvent.click(button);
      await rerender();
      expect(getByText("2")).to.exist;

      fireEvent.click(button);
      await rerender();
      expect(getByText("3")).to.exist;
    });

    it("Updates multi state", async () => {
      const { rerender, getByText } = await render(multiState, {
        value: 3,
        value2: 10
      });
      const button = getByText("Increment");

      fireEvent.click(button);
      await rerender();
      expect(getByText("4").id).to.equal("1");
      expect(getByText("9").id).to.equal("2");

      fireEvent.click(button);
      await rerender();
      expect(getByText("5").id).to.equal("1");
      expect(getByText("8").id).to.equal("2");
    });

    it("Updates boolean state", async () => {
      const { rerender, getByText } = await render(booleanState);
      const button = getByText("Toggle");

      expect(getByText("false")).to.exist;
      fireEvent.click(button);
      await rerender();
      expect(getByText("true")).to.exist;
      fireEvent.click(button);
      await rerender();
      expect(getByText("false")).to.exist;
    });

    it("Updates assignment state", async () => {
      const { rerender, getByText } = await render(assignmentState);
      const button = getByText("Switch");

      expect(getByText("1")).to.exist;
      fireEvent.click(button);
      await rerender();
      expect(getByText("2")).to.exist;
      fireEvent.click(button);
      await rerender();
      expect(getByText("1")).to.exist;
    });

    it("Updates large function properly", async () => {
      const { rerender, getByText, getAllByText } = await render(largeFunction);
      const button = getByText("RunMe");

      expect(getByText("1").id).to.equal("1");
      expect(getAllByText("2").length).to.equal(2);
      fireEvent.click(button);
      await rerender();
      expect(getByText("3").id).to.equal("1");
      expect(getByText("2").id).to.equal("2");
      expect(getByText("-1").id).to.equal("3");

      fireEvent.click(button);
      await rerender();
      expect(getAllByText("3").length).to.equal(2);
      expect(getByText("-1").id).to.equal("3");

      fireEvent.click(button);
      await rerender();
      expect(getAllByText("1").length).to.equal(2);
      expect(getByText("3").id).to.equal("2");
    });

    it("Updates with no initializer properly", async () => {
      const { rerender, getByText, getAllByText } = await render(noInit);
      const button = getByText("Increment");

      expect(getByText("1").id).to.equal("1");
      expect(getByText("notInit").id).to.equal("2");
      fireEvent.click(button);
      await rerender();
      expect(getByText("2").id).to.equal("1");
      expect(getByText("1").id).to.equal("2");
      fireEvent.click(button);
      await rerender();
      expect(getByText("3").id).to.equal("1");
      expect(getByText("2").id).to.equal("2");
    });
  });
});
