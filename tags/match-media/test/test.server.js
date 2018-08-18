const assert = require("assert");
const template = require("../");

describe("server", () => {
  it("renders the default media query", done => {
    template.renderToString({
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
        tablet: false,
        desktop: false
      });

      done();
    }
  });
});
