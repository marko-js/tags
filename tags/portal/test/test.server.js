const assert = require("assert");
const sinon = require("sinon");
const { render } = require("@marko/testing-library");
const template = require("../").default;

describe("server", () => {
  it("does not render anything", async () => {
    const renderBodySpy = sinon.spy();
    const { container } = await render(template, {
      renderBody: renderBodySpy,
      target: "somewhere",
    });

    assert.ok(renderBodySpy.notCalled);
    assert.strictEqual(container.childElementCount, 0);
  });
});
