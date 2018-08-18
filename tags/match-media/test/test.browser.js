const assert = require("assert");
const template = require("../");

describe("browser", () => {
  it("renders the the media query based on the current screen size", done => {
    template.renderSync({
      renderBody,
      "*": {
        mobile: "(max-width: 767px)",
        tablet: "(min-width: 768px) and (max-width: 1024px)",
        desktop: "(min-width: 1025px)"
      }
    });

    function renderBody(out, matches) {
      assert.deepEqual(matches, {
        mobile: false,
        tablet: true,
        desktop: false
      });

      done();
    }
  });
});
