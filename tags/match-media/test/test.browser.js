const assert = require("assert");
const template = require("../");
const SIZES = {
  desktop: "1025px",
  tablet: "768px",
  mobile: "767px"
};

describe("browser", () => {
  /** @type {HTMLFrameElement} */
  let frame;
  let matchMedia = window.matchMedia;
  let component;
  let matches;

  beforeEach(done => {
    frame = document.createElement("iframe");
    frame.style.width = SIZES.desktop;
    document.body.appendChild(frame);
    window.matchMedia = frame.contentWindow.matchMedia;
    waitFrames(frame.contentWindow, 10, () => {
      component = template
        .renderSync({
          renderBody(out, _matches) {
            matches = _matches;
          },
          "*": {
            mobile: "(max-width: 767px)",
            tablet: "(min-width: 768px) and (max-width: 1024px)",
            desktop: "(min-width: 1025px)"
          }
        })
        .appendTo(frame.contentDocument.body)
        .getComponent();
      done();
    });
  });

  afterEach(() => {
    window.matchMedia = matchMedia;
    component.destroy();
    frame.remove();
  });

  it("matches current screen size (desktop) on mount", () => {
    assert.deepEqual(matches, {
      desktop: true,
      tablet: false,
      mobile: false
    });
  });

  it("updates to match tablet", done => {
    frame.style.width = SIZES.tablet;
    waitFrames(frame.contentWindow, 10, () => {
      assert.deepEqual(matches, {
        desktop: false,
        tablet: true,
        mobile: false
      });
      done();
    });
  });

  it("updates to match mobile", done => {
    frame.style.width = SIZES.mobile;
    waitFrames(frame.contentWindow, 10, () => {
      assert.deepEqual(matches, {
        desktop: false,
        tablet: false,
        mobile: true
      });
      done();
    });
  });

  it("can change media queries", done => {
    component.input = {
      renderBody(out, matches) {
        assert.deepEqual(matches, {
          landscape: true,
          portrait: false
        });
        done();
      },
      "*": {
        landscape: "(orientation: landscape)",
        portrait: "(orientation: portrait)"
      }
    };
  });
});

function waitFrames(win, count, fn) {
  if (count)
    return win.requestAnimationFrame(() => waitFrames(win, count - 1, fn));
  fn();
}
