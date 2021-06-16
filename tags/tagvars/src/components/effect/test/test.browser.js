const { expect, use } = require("chai");
const { spy, resetHistory } = require("sinon");
const { render, screen, fireEvent } = require("@marko/testing-library");
const Basic = require("./fixtures/basic.marko").default;

use(require("chai-dom"));
use(require("sinon-chai"));

describe("browser", () => {
  it("basic", async () => {
    const onCount = spy();
    const onCleanup = spy();
    const { rerender, cleanup } = await render(Basic, { onCount, onCleanup });
    const btn = screen.getByText("increment");

    expect(onCount).calledOnceWith(0);
    expect(onCleanup).has.not.been.called;
    resetHistory();

    await fireEvent.click(btn);
    expect(onCount).calledOnceWith(1);
    expect(onCleanup).has.been.calledOnce;
    resetHistory();

    await rerender();
    expect(onCount).has.not.been.called;
    expect(onCleanup).has.not.been.called;

    cleanup();
    expect(onCleanup).has.been.calledOnce;
  });
});
