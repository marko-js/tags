const sinon = require("sinon");
const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("sinon-chai"));
const template = require("../").default;
const SIZES = {
  desktop: "1025px",
  tablet: "768px",
  mobile: "767px",
};

describe("browser", () => {
  /** @type {HTMLFrameElement} */
  let frame;
  let rerender;
  const renderBodySpy = sinon.spy();
  const matchMedia = window.matchMedia;

  beforeEach(async () => {
    frame = document.createElement("iframe");
    frame.style.width = SIZES.desktop;
    document.body.appendChild(frame);
    window.matchMedia = frame.contentWindow.matchMedia;
    await waitFrames(frame.contentWindow, 10);
    const renderResult = await render(template, {
      renderBody: renderBodySpy,
      queries: {
        mobile: "(max-width: 767px)",
        tablet: "(min-width: 768px) and (max-width: 1024px)",
        desktop: "(min-width: 1025px)",
      },
    });

    rerender = renderResult.rerender;
  });

  afterEach(() => {
    window.matchMedia = matchMedia;
    renderBodySpy.resetHistory();
    frame.remove();
    cleanup();
  });

  it("matches current screen size (desktop) on mount", () => {
    expect(renderBodySpy).calledOnceWith(sinon.match.any, {
      desktop: true,
      tablet: false,
      mobile: false,
    });
  });

  it("updates to match tablet", async () => {
    frame.style.width = SIZES.tablet;
    await waitFrames(frame.contentWindow, 10);
    expect(renderBodySpy).calledWith(sinon.match.any, {
      desktop: false,
      tablet: true,
      mobile: false,
    });
  });

  it("updates to match mobile", async () => {
    frame.style.width = SIZES.mobile;
    await waitFrames(frame.contentWindow, 10);
    expect(renderBodySpy).calledWith(sinon.match.any, {
      desktop: false,
      tablet: false,
      mobile: true,
    });
  });

  it("can change media queries", async () => {
    await rerender({
      renderBody: renderBodySpy,
      queries: {
        landscape: "(orientation: landscape)",
        portrait: "(orientation: portrait)",
      },
    });

    expect(renderBodySpy).calledWith(sinon.match.any, {
      landscape: true,
      portrait: false,
    });
  });
});

function waitFrames(win, count) {
  if (count)
    return new Promise((resolve) =>
      win.requestAnimationFrame(resolve)
    ).then(() => waitFrames(win, count - 1));

  return Promise.resolve();
}
