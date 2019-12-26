const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("sinon-chai"));
const template = require("../");

describe("browser", () => {
  const targetA = document.createElement("div");
  const targetB = document.createElement("div");
  let rerender;

  targetA.id = "a";
  targetB.id = "b";

  before(() => {
    document.body.appendChild(targetA);
    document.body.appendChild(targetB);
  });

  after(() => {
    document.body.removeChild(targetA);
    document.body.removeChild(targetB);
  });

  beforeEach(async () => {
    ({ rerender } = await render(template, {
      renderBody(out) {
        out.text("A");
      },
      target: targetA.id
    }));
  });

  afterEach(() => {
    cleanup();
    targetA.innerHTML = targetB.innerHTML = "";
  });

  it("should have rendered the initial content", () => {
    expect(targetA).has.text("A");
  });

  it("can update the content", async () => {
    await rerender({
      renderBody(out) {
        out.text("B");
      },
      target: targetA.id
    });
    expect(targetA).has.text("B");
  });

  it("can change the target", async () => {
    await rerender({
      renderBody(out) {
        out.text("A");
      },
      target: targetB.id
    });
    expect(targetA).has.text("");
    expect(targetB).has.text("A");
  });
});
