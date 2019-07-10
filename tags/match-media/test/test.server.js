const assert = require("assert");
const sinon = require("sinon");
const { render } = require("@marko/testing-library");
const template = require("../");

describe("server", () => {
  it("renders with all queries false", async () => {
    const renderBodySpy = sinon.spy();
    await render(template, {
      renderBody: renderBodySpy,
      "*": {
        mobile: "(max-width: 767px)",
        tablet: "(min-width: 768px) and (max-width: 1024px)",
        desktop: "(min-width: 1025px)"
      }
    });

    assert.ok(
      renderBodySpy.firstCall.calledWith(sinon.match.any, {
        mobile: false,
        tablet: false,
        desktop: false
      })
    );
  });
});
